/// /////////////////////////////////////////////////////////////////////////////
// Dragging

const uploadButton = document.querySelector('#upload')
const exampleButton = document.querySelector('#example')
let dragging = 0
let filesInput

function isFilesDragEvent (e) {
  return e.dataTransfer && e.dataTransfer.types && Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') !== -1
}

document.ondragover = e => {
  e.preventDefault()
}

document.ondragenter = e => {
  e.preventDefault()
  if (!isFilesDragEvent(e)) return
  document.body.classList.add('drop')
  dragging++
}

document.ondragleave = e => {
  e.preventDefault()
  if (!isFilesDragEvent(e)) return
  if (--dragging === 0) document.body.classList.remove('drop')
}

document.ondrop = e => {
  e.preventDefault()
  document.body.classList.remove('drop')
  dragging = 0
  if (isFilesDragEvent(e) && e.dataTransfer.files) startLoading(e.dataTransfer.files)
}

uploadButton.onclick = () => {
  if (filesInput) filesInput.remove()
  filesInput = createElement('input', { type: 'file', multiple: true })
  filesInput.style.display = 'none'
  document.body.append(filesInput)
  filesInput.click()
  filesInput.onchange = () => startLoading(filesInput.files)
}

exampleButton.onclick = async () => {
  const name = 'example.fig'
  const arrayBuffer = await fetch('./' + name).then(r => r.arrayBuffer())
  startLoading([{ name, arrayBuffer }])
}

/// /////////////////////////////////////////////////////////////////////////////
// Loading

const start = document.querySelector('#start')
const loaded = document.querySelector('#loaded')
const sidebar = document.querySelector('#sidebar')
const preview = document.querySelector('#preview')
const progress = document.querySelector('#progress')
const progressInner = document.querySelector('#progress .bar div')
const previewURLs = new Map()
const parsedFiles = new Map()
let progressStartTime
let progressUpdateTime
let progressCurrentCount
let progressTotalCount
let progressOutput
let progressCancel
let downloadURL

onresize = () => sidebar.size = innerWidth >= 500 ? 2 : 1
onresize()

document.querySelector('#cancel').onclick = () => progressCancel = true

function loadFile (file) {
  return new Promise((resolve, reject) => {
    if (file.arrayBuffer instanceof ArrayBuffer) {
      resolve(file.arrayBuffer)
      return
    }
    const reader = new FileReader()
    reader.onerror = reject
    reader.onloadend = () => resolve(reader.result)
    reader.readAsArrayBuffer(file)
  })
}

async function updateProgress () {
  const percent = 100 * progressCurrentCount / progressTotalCount
  const currentTime = Date.now()
  if (!loaded.inert && currentTime - progressStartTime > 100 && percent < 50) {
    loaded.inert = true
    progress.style.display = 'flex'
  }
  progressUpdateTime = currentTime + 16
  progressInner.style.width = percent + '%'
  await new Promise(r => setTimeout(r))
  if (progressCancel) throw 'Cancel'
}

function countObjectsWithChildren (obj) {
  if (!obj) return 0
  const children = obj.children
  if (!Array.isArray(children)) return 0
  let count = 1
  for (const child of children) count += countObjectsWithChildren(child)
  return count
}

async function downloadFile (filename, contents) {
  if (downloadURL) URL.revokeObjectURL(downloadURL)

  if (contents instanceof Uint8Array) {
    progressOutput = contents
  } else {
    // Convert to JSON can take a while, so allow it to be canceled
    progressCancel = false
    progressStartTime = Date.now()
    progressUpdateTime = progressStartTime + 16
    progressCurrentCount = 0
    progressTotalCount = countObjectsWithChildren(contents.root)
    progressOutput = ''
    try {
      await new Promise(r => setTimeout(r))
      await jsonToPrettyString(contents)
      progressOutput += '\n'
    } catch (err) {
      if (err === 'Cancel') return
      throw err
    } finally {
      loaded.inert = false
      progress.style.display = 'none'
    }
  }

  const url = URL.createObjectURL(new Blob([progressOutput]))
  const a = createElement('a', { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  downloadURL = url
}

async function startLoading (files) {
  previewURLs.forEach(url => URL.revokeObjectURL(url))
  previewURLs.clear()
  parsedFiles.clear()

  try {
    if (files.length !== 1) throw new Error('Expected a single file')
    const originalFilePrefix = files[0].name.replace(/\.fig$/, '')
    const arrayBuffer = await loadFile(files[0])
    const bytes = new Uint8Array(arrayBuffer)
    sidebar.innerHTML = ''
    preview.innerHTML = ''

    const entries = String.fromCharCode(...bytes.slice(0, 2)) === 'PK'
      ? await new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(arrayBuffer))).getEntries()
      : [{ filename: files[0].name, bytes: new Uint8Array(arrayBuffer) }]
    const fileEntries = []

    for (const entry of entries) {
      if (entry.directory) continue
      sidebar.append(createElement('option', { textContent: entry.filename }))
      fileEntries.push(entry)
    }

    sidebar.oninput = () => {
      const entry = fileEntries[sidebar.selectedIndex]
      if (entry) {
        if (entry.getData) {
          entry.getData(new zip.Uint8ArrayWriter()).then(
            bytes => showPreview(entry.filename, bytes, originalFilePrefix))
        } else {
          showPreview(entry.filename, entry.bytes, originalFilePrefix)
        }
      }
    }

    if (fileEntries.length > 0) {
      sidebar.selectedIndex = 0
      sidebar.oninput()
    }

    loaded.style.display = 'block'
    start.style.display = 'none'
    sidebar.focus()
  } catch (err) {
    document.querySelector('#start .error').textContent = `❌ ${err}`

    loaded.style.display = 'none'
    start.style.display = 'flex'
  }
}

function showPreview (filename, bytes, originalFilePrefix) {
  const info = createElement('div', { className: 'info' })
  const header = createElement('h3', { textContent: 'Unknown file type' })
  const download = createElement('div', { textContent: 'Download: ' })
  preview.innerHTML = ''
  preview.append(info)
  info.append(
    header,
    createElement('div', { textContent: `Path: ${filename}` }),
    createElement('div', { textContent: `Size: ${humanSize(bytes.length)}` }),
    download)

  const downloadOriginal = createElement('button', { textContent: 'Original' })
  downloadOriginal.onclick = () => downloadFile(originalFilePrefix + '.' + filename, bytes)
  download.append(downloadOriginal)

  const isPNG = String.fromCharCode(...bytes.slice(0, 8)) === String.fromCharCode(137, 80, 78, 71, 13, 10, 26, 10)
  const isJPEG = String.fromCharCode(...bytes.slice(0, 2)) === String.fromCharCode(255, 216)
  const isGIF = ['GIF87a', 'GIF89a'].includes(String.fromCharCode(...bytes.slice(0, 6)))

  // Image
  if (isPNG || isJPEG || isGIF) {
    header.textContent = isPNG ? 'PNG Image' : isJPEG ? 'JPEG Image' : isGIF ? 'GIF Image' : 'Image'
    const dimensions = createElement('div', { textContent: 'Dimensions:' })
    info.append(dimensions)
    let url = previewURLs.get(filename)
    if (!url) {
      url = URL.createObjectURL(new Blob([bytes]))
      previewURLs.set(filename, url)
    }
    const img = new Image()
    img.src = url
    img.onload = () => dimensions.textContent = `Dimensions: ${img.naturalWidth}\xD7${img.naturalHeight}`
    preview.append(img)
    return
  }

  // JSON
  if (filename.endsWith('.json')) {
    const json = JSON.parse(new TextDecoder().decode(bytes))
    header.textContent = 'JSON'
    downloadOriginal.onclick = () => downloadFile(originalFilePrefix + '.' + filename, json)

    // Interactive JSON viewer
    const pre = document.createElement('pre')
    prettyPrintJSON(pre, json)
    preview.append(pre)
    return
  }

  // Figma
  const figHeader = String.fromCharCode(...bytes.slice(0, 8))
  if (figHeader === 'fig-kiwi' || figHeader === 'fig-jam.') {
    header.textContent = figHeader === 'fig-jam.' ? 'FigJam Data' : 'Figma Data'

    // Export as JSON button
    let result = parsedFiles.get(filename)
    if (!result) {
      result = Fig.parse({ bytes, pako, kiwi })
      parsedFiles.set(filename, result)
    }
    const { root, blobs } = result
    const downloadJSON = createElement('button', { textContent: 'JSON' })
    downloadJSON.onclick = () => downloadFile(originalFilePrefix + '.' + filename.replace(/\.fig$/, '') + '.json', result)
    download.append(' ', downloadJSON)

    // Make blob contents easier to understand
    const substituteBlob = (key, value) => {
      if (key.endsWith('Blob') && typeof value === 'number' && value === (value >>> 0) && value < blobs.length) {
        key = key.slice(0, -4)
        value = blobs[value]
        value = Fig.parseBlob(key, value) || value
      }
      return [key, value]
    }

    // Interactive JSON viewer
    const pre = document.createElement('pre')
    prettyPrintJSON(pre, root, substituteBlob)
    preview.append(pre)
  }
}

function createElement (tagName, args) {
  const el = document.createElement(tagName)
  for (const key in args) el[key] = args[key]
  return el
}

function humanSize (byteLength) {
  if (byteLength > 1_000_000) return `${+(byteLength / 1_000_000).toFixed(1)} MB`
  if (byteLength > 1_000) return `${+(byteLength / 1_000).toFixed(1)} KB`
  return `${byteLength} bytes`
}

/// /////////////////////////////////////////////////////////////////////////////
// Viewing

const keysToCollapse = new Set([
  'baselines',
  'children',
  'derivedSymbolData',
  'effects',
  'exportSettings',
  'fillGeometry',
  'fillPaints',
  'glyphs',
  'layoutGrids',
  'overrides',
  'stops',
  'strokeGeometry',
  'strokePaints',
  'symbolOverrides',
  'textData',
  'vectorData'
])

const keysToShowWhenCollapsed = [
  'guidPath',
  'type',
  'name',
  'characters',
  'imageType',
  'firstCharacter',
  'endCharacter'
]

const TRAILING_COMMA_FLAG = 1
const SHOULD_COLLAPSE_FLAG = 2
const IS_COLLAPSED_FLAG = 4
const DID_TOGGLE_FLAG = 8

function prettyPrintJSON (el, value, substituteBlob, depth = 0, flags = 0) {
  switch (typeof value) {
    case 'number':
      el.append(createElement('span', { className: 'number', textContent: value }))
      if (flags & TRAILING_COMMA_FLAG) el.append(',')
      return

    case 'boolean':
      el.append(createElement('span', { className: 'boolean', textContent: value }))
      if (flags & TRAILING_COMMA_FLAG) el.append(',')
      return

    case 'string':
      el.append(createElement('span', { className: 'string', textContent: JSON.stringify(value) }))
      if (flags & TRAILING_COMMA_FLAG) el.append(',')
      return

    case 'object':
      if (value === null) {
        el.append(createElement('span', { className: 'null', textContent: value }))
        if (flags & TRAILING_COMMA_FLAG) el.append(',')
        return
      }

      if (Array.isArray(value) || value instanceof Uint8Array) {
        if (flags & SHOULD_COLLAPSE_FLAG && value.length > 10) {
          const expandable = createElement('span', { className: 'expandable' })
          prettyPrintCollapsedArray(expandable, value, substituteBlob, depth, flags)
          el.append(expandable)
          return
        }

        prettyPrintExpandedArray(el, value, substituteBlob, depth, flags)
        return
      }
  }

  if (flags & SHOULD_COLLAPSE_FLAG) {
    const expandable = createElement('span', { className: 'expandable' })
    prettyPrintCollapsedObject(expandable, value, substituteBlob, depth, flags)
    el.append(expandable)
    return
  }

  prettyPrintExpandedObject(el, value, substituteBlob, depth, flags)
}

function prettyPrintCollapsedArray (el, array, substituteBlob, depth, flags) {
  const expand = createElement('a', { className: 'expand', textContent: '\xB7\xB7\xB7', tabIndex: 0 })
  el.append('[ ', expand, ' ]')

  expand.onkeydown = e => {
    if (e.key === 'Enter') expand.click()
  }

  expand.onclick = () => {
    el.innerHTML = ''
    prettyPrintExpandedArray(el, array, substituteBlob, depth, flags | DID_TOGGLE_FLAG)
  }

  if (flags & DID_TOGGLE_FLAG) expand.focus()
}

function prettyPrintExpandedArray (el, array, substituteBlob, depth, flags) {
  const multiline = !(flags & IS_COLLAPSED_FLAG) && (flags & DID_TOGGLE_FLAG || array.length > 20 || array.some(item => typeof item === 'object'))
  const closeBracket = flags & TRAILING_COMMA_FLAG ? '],' : ']'

  if (array.length === 0) {
    el.append('[' + closeBracket)
    return
  }

  el.append('[')
  if (flags & DID_TOGGLE_FLAG) {
    const collapse = createElement('a', { className: 'expand', textContent: '\xB7\xB7\xB7', tabIndex: 0 })
    el.append(' ', collapse)

    collapse.onkeydown = e => {
      if (e.key === 'Enter') collapse.click()
    }

    collapse.onclick = () => {
      el.innerHTML = ''
      prettyPrintCollapsedArray(el, array, substituteBlob, depth, flags)
    }

    collapse.focus()
  }

  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    let itemEl = el
    if (multiline) {
      itemEl = createElement('div', { className: 'line' })
      itemEl.style.paddingLeft = (depth + 2) * 2 + 'ch'
      itemEl.style.textIndent = (depth + 2) * -2 + 'ch'
      itemEl.style.marginLeft = (depth ? depth + 1 : 0) * -2 + 'ch'
      itemEl.append('  '.repeat(depth + 1))
      el.append(itemEl)
    } else {
      el.append(' ')
    }
    prettyPrintJSON(itemEl, item, substituteBlob, depth + 1,
      (flags & (SHOULD_COLLAPSE_FLAG | IS_COLLAPSED_FLAG)) |
      (multiline ? 0 : IS_COLLAPSED_FLAG) |
      (i + 1 < array.length ? TRAILING_COMMA_FLAG : 0))

    // Parsed paths repeatedly contain a string followed by
    // numbers. Put the numbers on the same line as the string.
    if (typeof item === 'string') {
      while (i + 1 < array.length && typeof array[i + 1] === 'number') {
        itemEl.append(' ')
        prettyPrintJSON(itemEl, array[++i], substituteBlob, depth + 1,
          (flags & (SHOULD_COLLAPSE_FLAG | IS_COLLAPSED_FLAG)) |
          (multiline ? 0 : IS_COLLAPSED_FLAG) |
          (i + 1 < array.length ? TRAILING_COMMA_FLAG : 0))
      }
    }
  }

  el.append(multiline ? createElement('div', { textContent: '  '.repeat(depth) + closeBracket }) : ' ' + closeBracket)
}

function prettyPrintCollapsedObject (el, obj, substituteBlob, depth, flags) {
  const expand = createElement('a', { className: 'expand', textContent: '\xB7\xB7\xB7', tabIndex: 0 })
  el.append('{ ', expand)

  for (const key of keysToShowWhenCollapsed) {
    if (key in obj) {
      el.append(', ', createElement('span', { className: 'key', textContent: key }), ': ')
      prettyPrintJSON(el, obj[key], substituteBlob, depth, IS_COLLAPSED_FLAG)
    }
  }

  if (isColor(obj.color)) {
    el.append(', ',
      createElement('span', { className: 'key', textContent: 'color' }), ': ',
      colorDecorator(obj.color, obj.opacity))

    // Handle gradient color stops
    if (typeof obj.position === 'number') {
      el.append(', ',
        createElement('span', { className: 'key', textContent: 'position' }), ': ',
        createElement('span', { className: 'number', textContent: obj.position }))
    }
  }

  if ('commandsBlob' in obj) {
    let key = 'commandsBlob'
    let value = obj.commandsBlob
    if (substituteBlob) [key, value] = substituteBlob(key, value)
    if (key === 'commands') {
      const bounds = boundsOfPath(value)
      if (bounds) {
        el.append(', ',
          createElement('span', { className: 'key', textContent: key }), ': ',
          pathDecorator(value, bounds, obj))
      }
    }
  }

  if ('vectorNetworkBlob' in obj) {
    let key = 'vectorNetworkBlob'
    let value = obj.vectorNetworkBlob
    if (substituteBlob) [key, value] = substituteBlob(key, value)
    if (key === 'vectorNetwork') {
      const bounds = boundsOfVectorNetwork(value)
      if (bounds) {
        el.append(', ',
          createElement('span', { className: 'key', textContent: key }), ': ',
          vectorNetworkDecorator(value, bounds))
      }
    }
  }

  el.append(' }')

  expand.onkeydown = e => {
    if (e.key === 'Enter') expand.click()
  }

  expand.onclick = () => {
    el.innerHTML = ''
    prettyPrintExpandedObject(el, obj, substituteBlob, depth, flags | DID_TOGGLE_FLAG)
  }

  if (flags & DID_TOGGLE_FLAG) expand.focus()
}

function prettyPrintExpandedObject (el, obj, substituteBlob, depth, flags) {
  const keys = Object.keys(obj)
  const multiline = !(flags & IS_COLLAPSED_FLAG) && (flags & DID_TOGGLE_FLAG || keys.length > 8 || keys.some(key => typeof obj[key] === 'object'))
  const closeBracket = flags & TRAILING_COMMA_FLAG ? '},' : '}'

  if (keys.length === 0) {
    el.append('[' + closeBracket)
    return
  }

  el.append('{')
  if (flags & DID_TOGGLE_FLAG) {
    const collapse = createElement('a', { className: 'expand', textContent: '\xB7\xB7\xB7', tabIndex: 0 })
    el.append(' ', collapse)

    collapse.onkeydown = e => {
      if (e.key === 'Enter') collapse.click()
    }

    collapse.onclick = () => {
      el.innerHTML = ''
      prettyPrintCollapsedObject(el, obj, substituteBlob, depth, flags)
    }

    collapse.focus()
  }

  const nameIndex = keys.indexOf('name')
  const childrenIndex = keys.indexOf('children')

  if (nameIndex >= 0 && childrenIndex > nameIndex) {
    keys.splice(nameIndex + 1, 0, keys.splice(childrenIndex, 1)[0])
  }

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let value = obj[key]
    if (substituteBlob) [key, value] = substituteBlob(key, value)
    let itemEl = el
    if (multiline) {
      itemEl = createElement('div', { className: 'line' })
      itemEl.style.paddingLeft = (depth + 2) * 2 + 'ch'
      itemEl.style.textIndent = (depth + 2) * -2 + 'ch'
      itemEl.style.marginLeft = (depth ? depth + 1 : 0) * -2 + 'ch'
      itemEl.append('  '.repeat(depth + 1))
      el.append(itemEl)
    } else {
      el.append(' ')
    }
    itemEl.append(createElement('span', { className: 'key', textContent: JSON.stringify(key).slice(1, -1) }), ': ')

    if ((key === 'color' || key === 'backgroundColor' || key === 'background_color') && isColor(value)) {
      itemEl.append(colorDecorator(value), ' ')
    } else if (key === 'commands') {
      const bounds = boundsOfPath(value)
      if (bounds) itemEl.append(pathDecorator(value, bounds, obj), ' ')
    } else if (key === 'vectorNetwork') {
      const bounds = boundsOfVectorNetwork(value)
      if (bounds) itemEl.append(vectorNetworkDecorator(value, bounds), ' ')
    }

    prettyPrintJSON(itemEl, value, substituteBlob, depth + 1,
      (flags & IS_COLLAPSED_FLAG) |
      (multiline ? 0 : IS_COLLAPSED_FLAG) |
      (i + 1 < keys.length ? TRAILING_COMMA_FLAG : 0) |
      (keysToCollapse.has(key) ? SHOULD_COLLAPSE_FLAG : 0))
  }

  el.append(multiline ? createElement('div', { textContent: '  '.repeat(depth) + closeBracket }) : ' ' + closeBracket)
}

function isColor (value) {
  return typeof value === 'object' && Object.keys(value).sort().join('') === 'abgr'
}

function colorDecorator ({ r, g, b, a }, opacity) {
  if (typeof opacity === 'number') a *= opacity
  const color = createElement('span', { className: 'color' })
  color.style.background = `linear-gradient(rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a}) 0% 100%), ` +
    'conic-gradient(white 0% 25%, #DDD 25% 50%, white 50% 75%, #DDD 75% 100%)'
  return color
}

function boundsOfPath (path) {
  if (!Array.isArray(path)) return
  const counts = { Z: 0, M: 2, L: 2, Q: 4, C: 6 }
  let xmin = Infinity
  let ymin = Infinity
  let xmax = -Infinity
  let ymax = -Infinity
  let i = 0
  while (i < path.length) {
    let count = counts[path[i++]]
    if (count === undefined || i + count > path.length) return
    while (count > 0) {
      const x = path[i++]
      const y = path[i++]
      if (typeof x !== 'number' || typeof y !== 'number') return
      if (x < xmin) xmin = x
      if (y < ymin) ymin = y
      if (x > xmax) xmax = x
      if (y > ymax) ymax = y
      count -= 2
    }
  }
  return [xmin, ymin, xmax, ymax]
}

function pathDecorator (path, [xmin, ymin, xmax, ymax], obj) {
  const canvas = createElement('canvas', { className: 'path' })
  const c = canvas.getContext('2d')
  const redraw = () => {
    const ratio = window.devicePixelRatio || 1
    const scale = 15 * ratio / Math.max(xmax - xmin, ymax - ymin)
    const isGlyph = typeof obj.advance === 'number'
    canvas.width = Math.round(16 * ratio)
    canvas.height = Math.round(16 * ratio)

    c.fillStyle = getComputedStyle(document.body).color
    c.globalAlpha = 0.2
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1

    c.translate(canvas.width / 2, canvas.height / 2)
    c.scale(scale, isGlyph ? -scale : scale)
    c.translate(-(xmin + xmax) / 2, -(ymin + ymax) / 2)
    c.beginPath()

    let i = 0
    while (i < path.length) {
      switch (path[i++]) {
        case 'Z': c.closePath(); break
        case 'M': c.moveTo(path[i++], path[i++]); break
        case 'L': c.lineTo(path[i++], path[i++]); break
        case 'Q': c.quadraticCurveTo(path[i++], path[i++], path[i++], path[i++]); break
        case 'C': c.bezierCurveTo(path[i++], path[i++], path[i++], path[i++], path[i++], path[i++]); break
      }
    }

    c.fill(obj.windingRule === 'ODD' ? 'evenodd' : 'nonzero')
  }
  canvas.redraw = redraw
  redraw()
  return canvas
}

function boundsOfVectorNetwork (network) {
  if (typeof network !== 'object' || network === null || !Array.isArray(network.vertices) || !Array.isArray(network.segments)) return
  let xmin = Infinity
  let ymin = Infinity
  let xmax = -Infinity
  let ymax = -Infinity
  for (const { x, y } of network.vertices) {
    if (typeof x !== 'number' || typeof y !== 'number') return
    if (x < xmin) xmin = x
    if (y < ymin) ymin = y
    if (x > xmax) xmax = x
    if (y > ymax) ymax = y
  }
  for (const { start, end } of network.segments) {
    for (const { vertex, dx, dy } of [start, end]) {
      let { x, y } = network.vertices[vertex]
      if (typeof dx !== 'number' || typeof dy !== 'number') return
      x += dx
      y += dy
      if (x < xmin) xmin = x
      if (y < ymin) ymin = y
      if (x > xmax) xmax = x
      if (y > ymax) ymax = y
    }
  }
  return [xmin, ymin, xmax, ymax]
}

function vectorNetworkDecorator ({ vertices, segments }, [xmin, ymin, xmax, ymax]) {
  const canvas = createElement('canvas', { className: 'path' })
  const c = canvas.getContext('2d')
  const redraw = () => {
    const ratio = window.devicePixelRatio || 1
    const scale = 15 * ratio / Math.max(xmax - xmin, ymax - ymin)
    canvas.width = Math.round(16 * ratio)
    canvas.height = Math.round(16 * ratio)

    c.fillStyle = c.strokeStyle = getComputedStyle(document.body).color
    c.globalAlpha = 0.2
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalAlpha = 1

    c.translate(canvas.width / 2, canvas.height / 2)
    c.scale(scale, scale)
    c.translate(-(xmin + xmax) / 2, -(ymin + ymax) / 2)

    c.beginPath()
    for (const { start, end } of segments) {
      const from = vertices[start.vertex]
      const to = vertices[end.vertex]
      c.moveTo(from.x, from.y)
      c.bezierCurveTo(
        from.x + start.dx, from.y + start.dy,
        to.x + end.dx, to.y + end.dy,
        to.x, to.y)
    }
    c.lineWidth = 1 / scale
    c.stroke()
  }
  canvas.redraw = redraw
  redraw()
  return canvas
}

// Keep canvas elements updated as dark mode changes
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  for (const canvas of document.querySelectorAll('canvas')) {
    if (canvas.redraw) canvas.redraw()
  }
})

async function jsonToPrettyString (value, depth = 0) {
  switch (typeof value) {
    case 'number':
    case 'boolean':
    case 'string':
      progressOutput += JSON.stringify(value) // Note: "NaN" turns into "null"
      return

    case 'object':
      if (value === null) {
        progressOutput += 'null'
        return
      }

      if (Array.isArray(value) || value instanceof Uint8Array) {
        const multiline = (value.length > 20 && value.some(item => typeof item !== 'number')) || value.some(item => typeof item === 'object')
        let comma = ''

        progressOutput += '['
        for (let i = 0; i < value.length; i++) {
          progressOutput += multiline ? `${comma}\n${'  '.repeat(depth + 1)}` : `${comma} `
          comma = ','
          if (!(i & 64) && Date.now() > progressUpdateTime) await updateProgress()
          await jsonToPrettyString(value[i], depth + 1)
        }
        if (comma) comma = ' '
        progressOutput += multiline ? `\n${'  '.repeat(depth)}]` : `${comma}]`
        return
      }
  }

  const keys = Object.keys(value)
  const multiline = keys.length > 8 || keys.some(key => typeof value[key] === 'object')
  let comma = ''

  progressOutput += '{'
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    const item = value[key]
    key = JSON.stringify(key)
    progressOutput += multiline ? `${comma}\n${'  '.repeat(depth + 1)}${key}: ` : `${comma} ${key}: `
    comma = ','
    if (!(i & 64) && Date.now() > progressUpdateTime) await updateProgress()
    await jsonToPrettyString(item, depth + 1)
  }
  if (comma) comma = ' '
  progressOutput += multiline ? `\n${'  '.repeat(depth)}}` : `${comma}}`

  if (Array.isArray(value.children)) progressCurrentCount++
}
