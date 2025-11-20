import test from "node:test";
import {versionBumpBranch} from "./version-bump.js";
import {strictEqual} from "assert";

test('version-bump', ()=>{
  strictEqual(versionBumpBranch({branch:'master',_versionStr:'1.0.0',digit:'patch'}), '1.0.1')
  strictEqual(versionBumpBranch({branch:'master',_versionStr:'1.0.1',digit:'minor'}), '1.1.0')
  strictEqual(versionBumpBranch({branch:'master',_versionStr:'1.1.1',digit:'major'}), '2.0.0')

  strictEqual(versionBumpBranch({branch:'master',_versionStr:'1.0.53',digit:'patch'}), '1.0.54')

  strictEqual(versionBumpBranch({branch:'bltest',_versionStr:'1.0.0',digit:'patch'}), '1.0.1-bltest.0')
  strictEqual(versionBumpBranch({branch:'bltest',_versionStr:'1.0.0-bltest.1',digit:'patch'}), '1.0.0-bltest.2')
  strictEqual(versionBumpBranch({branch:'bltest',_versionStr:'1.0.0-bltest.2',digit:'patch'}), '1.0.0-bltest.3')

  strictEqual(versionBumpBranch({branch:'bltoast',_versionStr:'1.0.0-bltest.2',digit:'patch'}), '1.0.0-bltoast.0')

  strictEqual(versionBumpBranch({branch:'bl/abcd',_versionStr:'1.0.0',digit:'patch'}), '1.0.1-blabcd.0')

  strictEqual(versionBumpBranch({branch:'bl/abcd-efg',_versionStr:'1.0.0',digit:'patch'}), '1.0.1-blabcdefg.0')

  strictEqual(versionBumpBranch({branch:'bl/abcd-efg',_versionStr:'1.0.0-abc.0',digit:'patch'}), '1.0.0-blabcdefg.0')

  strictEqual(versionBumpBranch({branch:'main',_versionStr:'1.0.0-alpha.343',digit:'patch'}), '1.0.1')
  strictEqual(versionBumpBranch({branch:'release',_versionStr:'1.0.0-alpha.343',digit:'patch'}), '1.0.1')


})
