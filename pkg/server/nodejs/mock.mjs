const MOCK_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudFlow - 现代SaaS解决方案</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" />
    <style>
        :root {
            --primary: #4F46E5;
            --primary-light: #6366F1;
            --success: #10B981;
            --warning: #F59E0B;
            --error: #EF4444;
            --bg-light: #FFFFFF;
            --bg-dark: #F9FAFB;
            --border: #E5E7EB;
            --text-primary: #1F2937;
            --text-secondary: #6B7280;
            --text-light: #FFFFFF;
            --gradient: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --radius-sm: 4px;
            --radius: 8px;
            --radius-lg: 12px;
            --transition: all 0.3s ease;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: var(--text-primary);
            line-height: 1.5;
            font-size: 16px;
            background-color: var(--bg-light);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            line-height: 1.2;
        }

        h1 {
            font-size: 36px;
            line-height: 1.2;
            margin-bottom: 1rem;
            font-weight: 800;
        }

        h2 {
            font-size: 30px;
            margin-bottom: 1.5rem;
        }

        h3 {
            font-size: 24px;
            margin-bottom: 1rem;
        }

        h4 {
            font-size: 20px;
            margin-bottom: 0.75rem;
        }

        p {
            margin-bottom: 1rem;
            color: var(--text-secondary);
        }

        a {
            color: var(--primary);
            text-decoration: none;
            transition: var(--transition);
        }

        a:hover {
            color: var(--primary-light);
        }

        img {
            max-width: 100%;
            height: auto;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        .section {
            padding: 5rem 0;
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title p {
            max-width: 600px;
            margin: 0 auto;
        }

        /* 导航栏 */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: 1rem 0;
            transition: var(--transition);
        }

        .navbar.scrolled {
            background-color: var(--bg-light);
            box-shadow: var(--shadow);
        }

        .navbar-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--primary);
            display: flex;
            align-items: center;
        }

        .logo img {
            height: 32px;
            margin-right: 0.5rem;
        }

        .nav-links {
            display: flex;
            align-items: center;
        }

        .nav-links a {
            margin-left: 2rem;
            color: var(--text-primary);
            font-weight: 500;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .nav-links .btn {
            margin-left: 2rem;
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-primary);
            cursor: pointer;
        }

        /* 按钮样式 */
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius);
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            font-size: 1rem;
            border: none;
        }

        .btn-primary {
            background: var(--gradient);
            color: var(--text-light);
            box-shadow: var(--shadow);
        }

        .btn-primary:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow-md);
            color: var(--text-light);
        }

        .btn-primary:active {
            transform: scale(0.98);
        }

        .btn-secondary {
            background: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
        }

        .btn-secondary:hover {
            background: rgba(79, 70, 229, 0.1);
            color: var(--primary);
        }

        .btn-text {
            background: transparent;
            color: var(--primary);
            padding: 0.5rem 0;
        }

        .btn-text:hover {
            text-decoration: underline;
        }

        /* 英雄区域 */
        .hero {
            padding: 8rem 0 5rem;
            position: relative;
            overflow: hidden;
        }

        .hero-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
        }

        .hero-content {
            flex: 1;
            max-width: 600px;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }

        .hero-buttons {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .hero-image {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            position: relative;
        }

        .hero-image img {
            max-width: 100%;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background-color: rgba(79, 70, 229, 0.1);
            color: var(--primary);
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        /* 特性区域 */
        .features {
            background-color: var(--bg-dark);
            padding: 5rem 0;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .feature-card {
            background-color: var(--bg-light);
            border-radius: var(--radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow);
            transition: var(--transition);
        }

        .feature-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
        }

        .feature-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(79, 70, 229, 0.1);
            color: var(--primary);
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .feature-title {
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }

        /* 产品优势区域 */
        .benefits {
            padding: 5rem 0;
        }

        .benefits-container {
            display: flex;
            align-items: center;
            gap: 4rem;
        }

        .benefits-image {
            flex: 1;
        }

        .benefits-image img {
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
        }

        .benefits-content {
            flex: 1;
        }

        .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1.5rem;
        }

        .benefit-icon {
            color: var(--primary);
            font-size: 1.5rem;
            margin-right: 1rem;
            flex-shrink: 0;
        }

        .benefit-text h4 {
            margin-bottom: 0.5rem;
        }

        /* 客户评价区域 */
        .testimonials {
            background-color: var(--bg-dark);
            padding: 5rem 0;
        }

        .swiper {
            width: 100%;
            padding: 2rem 1rem;
        }

        .testimonial-card {
            background-color: var(--bg-light);
            border-radius: var(--radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow);
            height: 100%;
        }

        .testimonial-content {
            margin-bottom: 1.5rem;
            font-style: italic;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
        }

        .testimonial-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 1rem;
            overflow: hidden;
        }

        .testimonial-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .testimonial-info h4 {
            margin-bottom: 0.25rem;
        }

        .testimonial-info p {
            font-size: 0.875rem;
            margin-bottom: 0;
        }

        .swiper-button-next, .swiper-button-prev {
            color: var(--primary);
        }

        .swiper-pagination-bullet-active {
            background-color: var(--primary);
        }

        /* 定价方案区域 */
        .pricing {
            padding: 5rem 0;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .pricing-card {
            background-color: var(--bg-light);
            border-radius: var(--radius-lg);
            padding: 2rem;
            border: 1px solid var(--border);
            transition: var(--transition);
            position: relative;
            overflow: hidden;
        }

        .pricing-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
        }

        .pricing-card.popular {
            border-color: var(--primary);
            box-shadow: var(--shadow-md);
        }

        .popular-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background-color: var(--primary);
            color: var(--text-light);
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
        }

        .pricing-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border);
        }

        .pricing-name {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }

        .pricing-price {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .pricing-period {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }

        .pricing-features {
            margin-bottom: 2rem;
        }

        .pricing-feature {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .pricing-feature i {
            color: var(--success);
            margin-right: 0.75rem;
        }

        .pricing-cta {
            text-align: center;
        }

        /* FAQ区域 */
        .faq {
            background-color: var(--bg-dark);
            padding: 5rem 0;
        }

        .faq-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .faq-item {
            margin-bottom: 1rem;
            border-radius: var(--radius);
            background-color: var(--bg-light);
            overflow: hidden;
        }

        .faq-question {
            padding: 1.25rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            transition: var(--transition);
        }

        .faq-question:hover {
            color: var(--primary);
        }

        .faq-question.active {
            color: var(--primary);
        }

        .faq-question i {
            transition: var(--transition);
        }

        .faq-question.active i {
            transform: rotate(45deg);
        }

        .faq-answer {
            padding: 0 1.25rem;
            max-height: 0;
            overflow: hidden;
            transition: var(--transition);
        }

        .faq-answer.active {
            padding: 0 1.25rem 1.25rem;
            max-height: 500px;
        }

        /* CTA区域 */
        .cta {
            padding: 5rem 0;
            background: var(--gradient);
            color: var(--text-light);
            text-align: center;
        }

        .cta-container {
            max-width: 700px;
            margin: 0 auto;
        }

        .cta h2 {
            color: var(--text-light);
            margin-bottom: 1.5rem;
        }

        .cta p {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
        }

        .cta .btn-secondary {
            background-color: var(--text-light);
            color: var(--primary);
            border: none;
        }

        .cta .btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.9);
        }

        /* 页脚 */
        .footer {
            background-color: #1F2937;
            color: var(--text-light);
            padding: 5rem 0 2rem;
        }

        .footer-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-logo {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--text-light);
            margin-bottom: 1rem;
            display: inline-block;
        }

        .footer-about p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
        }

        .footer-heading {
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
            color: var(--text-light);
        }

        .footer-links {
            list-style: none;
        }

        .footer-links li {
            margin-bottom: 0.75rem;
        }

        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            transition: var(--transition);
        }

        .footer-links a:hover {
            color: var(--text-light);
        }

        .social-links {
            display: flex;
            gap: 1rem;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--text-light);
            transition: var(--transition);
        }

        .social-link:hover {
            background-color: var(--primary);
            color: var(--text-light);
        }

        .footer-bottom {
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
        }

        .footer-bottom a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: underline;
        }

        .footer-bottom a:hover {
            color: var(--text-light);
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
            h1 {
                font-size: 32px;
            }

            h2 {
                font-size: 28px;
            }

            h3 {
                font-size: 22px;
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .benefits-container {
                flex-direction: column;
                gap: 3rem;
            }

            .benefits-image, .benefits-content {
                width: 100%;
            }
        }

        @media (max-width: 768px) {
            .section {
                padding: 4rem 0;
            }

            .hero {
                padding: 7rem 0 4rem;
            }

            .hero-container {
                flex-direction: column;
                text-align: center;
            }

            .hero-buttons {
                justify-content: center;
            }

            .hero-image {
                margin-top: 2rem;
                justify-content: center;
            }

            .nav-links {
                display: none;
            }

            .mobile-menu-btn {
                display: block;
            }

            .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: var(--bg-light);
                padding: 2rem;
                z-index: 1001;
                transform: translateX(-100%);
                transition: var(--transition);
            }

            .mobile-menu.active {
                transform: translateX(0);
            }

            .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .mobile-menu-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
            }

            .mobile-nav-links {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .mobile-nav-links a {
                color: var(--text-primary);
                font-size: 1.125rem;
            }
        }

        @media (max-width: 640px) {
            h1 {
                font-size: 28px;
            }

            h2 {
                font-size: 24px;
            }

            h3 {
                font-size: 20px;
            }

            .hero-title {
                font-size: 2rem;
            }

            .hero-subtitle {
                font-size: 1.125rem;
            }

            .hero-buttons {
                flex-direction: column;
                gap: 1rem;
            }

            .hero-buttons .btn {
                width: 100%;
            }

            .pricing-grid {
                grid-template-columns: 1fr;
            }
        }

        /* 动画 */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate {
            animation: fadeIn 0.6s ease forwards;
            opacity: 0;
        }

        .delay-1 {
            animation-delay: 0.2s;
        }

        .delay-2 {
            animation-delay: 0.4s;
        }

        .delay-3 {
            animation-delay: 0.6s;
        }
    </style>
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar" id="navbar">
        <div class="container navbar-container">
            <a href="#" class="logo">
                <img src="https://via.placeholder.com/32" alt="CloudFlow Logo">
                CloudFlow
            </a>
            <div class="nav-links">
                <a href="#features">产品特性</a>
                <a href="#pricing">定价</a>
                <a href="#resources">资源</a>
                <a href="#blog">博客</a>
                <a href="#signup" class="btn btn-primary">立即注册</a>
            </div>
            <button class="mobile-menu-btn" id="mobile-menu-btn">
                <i class="ph-list"></i>
            </button>
        </div>
    </nav>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-menu-header">
            <a href="#" class="logo">
                <img src="https://via.placeholder.com/32" alt="CloudFlow Logo">
                CloudFlow
            </a>
            <button class="mobile-menu-close" id="mobile-menu-close">
                <i class="ph-x"></i>
            </button>
        </div>
        <div class="mobile-nav-links">
            <a href="#features">产品特性</a>
            <a href="#pricing">定价</a>
            <a href="#resources">资源</a>
            <a href="#blog">博客</a>
            <a href="#signup" class="btn btn-primary">立即注册</a>
        </div>
    </div>

    <!-- 英雄区域 -->
    <section class="hero" id="hero">
        <div class="container hero-container">
            <div class="hero-content">
                <span class="badge animate">全新上线</span>
                <h1 class="hero-title animate">简化您的工作流程，提升团队效率</h1>
                <p class="hero-subtitle animate delay-1">CloudFlow 是一款现代化的 SaaS 解决方案，帮助团队更高效地协作、管理项目和自动化工作流程。</p>
                <div class="hero-buttons animate delay-2">
                    <a href="#signup" class="btn btn-primary">免费试用 14 天</a>
                    <a href="#features" class="btn btn-secondary">了解更多</a>
                </div>
            </div>
            <div class="hero-image animate delay-3">
                <img src="https://via.placeholder.com/600x400" alt="CloudFlow Dashboard">
            </div>
        </div>
    </section>

    <!-- 特性区域 -->
    <section class="features" id="features">
        <div class="container">
            <div class="section-title">
                <h2>为现代团队打造的强大功能</h2>
                <p>我们的平台提供了一系列强大的功能，帮助您的团队更高效地工作，无论是在办公室还是远程协作。</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="ph-lightning"></i>
                    </div>
                    <h3 class="feature-title">智能自动化</h3>
                    <p>通过自定义工作流程自动化重复性任务，节省时间并减少人为错误。</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="ph-users"></i>
                    </div>
                    <h3 class="feature-title">实时协作</h3>
                    <p>与团队成员实时协作，无论他们身在何处，都能保持高效沟通。</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="ph-chart-line-up"></i>
                    </div>
                    <h3 class="feature-title">高级分析</h3>
                    <p>通过直观的仪表盘和详细报告，深入了解团队绩效和项目进度。</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="ph-lock"></i>
                    </div>
                    <h3 class="feature-title">企业级安全</h3>
                    <p>采用最先进的安全措施保护您的数据，包括端到端加密和多因素认证。</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 产品优势区域 -->
    <section class="benefits" id="benefits">
        <div class="container benefits-container">
            <div class="benefits-image">
                <img src="https://via.placeholder.com/600x400" alt="CloudFlow Features">
            </div>
            <div class="benefits-content">
                <h2>为什么选择 CloudFlow？</h2>
                <p>我们的平台不仅仅是一个工具，而是您团队成功的合作伙伴。</p>
                
                <div class="benefit-item">
                    <div class="benefit-icon">
                        <i class="ph-check-circle"></i>
                    </div>
                    <div class="benefit-text">
                        <h4>提高生产力</h4>
                        <p>通过简化工作流程和自动化重复任务，平均提高团队生产力 35%。</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">
                        <i class="ph-check-circle"></i>
                    </div>
                    <div class="benefit-text">
                        <h4>降低成本</h4>
                        <p>减少对多个独立工具的依赖，节省高达 40% 的软件支出。</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">
                        <i class="ph-check-circle"></i>
                    </div>
                    <div class="benefit-text">
                        <h4>灵活扩展</h4>
                        <p>随着团队的成长，我们的平台可以轻松扩展，满足不断变化的需求。</p>
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">
                        <i class="ph-check-circle"></i>
                    </div>
                    <div class="benefit-text">
                        <h4>无缝集成</h4>
                        <p>与 100+ 常用工具无缝集成，包括 Slack、Google Workspace 和 Microsoft 365。</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 客户评价区域 -->
    <section class="testimonials" id="testimonials">
        <div class="container">
            <div class="section-title">
                <h2>客户如何评价我们</h2>
                <p>来自各行各业的客户分享他们使用 CloudFlow 的成功经验。</p>
            </div>
            
            <div class="swiper testimonial-swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"自从使用 CloudFlow 以来，我们的团队协作效率提高了 50%，项目交付时间缩短了近三分之一。这是我们尝试过的最好的项目管理工具。"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="testimonial-avatar">
                                    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson">
                                </div>
                                <div class="testimonial-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>产品经理, TechCorp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="swiper-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"CloudFlow 的自动化功能为我们节省了大量时间。我们现在可以专注于创造性工作，而不是被繁琐的管理任务所困扰。"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="testimonial-avatar">
                                    <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Michael Chen">
                                </div>
                                <div class="testimonial-info">
                                    <h4>Michael Chen</h4>
                                    <p>CTO, InnovateLab</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="swiper-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"作为一个远程团队，CloudFlow 帮助我们保持高效协作。实时编辑和强大的通知系统确保每个人都能及时了解项目进展。"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="testimonial-avatar">
                                    <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Emma Rodriguez">
                                </div>
                                <div class="testimonial-info">
                                    <h4>Emma Rodriguez</h4>
                                    <p>运营总监, RemoteFirst</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
    </section>

    <!-- 定价方案区域 -->
    <section class="pricing" id="pricing">
        <div class="container">
            <div class="section-title">
                <h2>简单透明的定价方案</h2>
                <p>选择最适合您团队需求的方案，所有方案均包含 14 天免费试用。</p>
            </div>
            
            <div class="pricing-grid">
                <div class="pricing-card">
                    <div class="pricing-header">
                        <h3 class="pricing-name">基础版</h3>
                        <div class="pricing-price">¥99</div>
                        <div class="pricing-period">每用户/月，按年付费</div>
                    </div>
                    <div class="pricing-features">
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>最多 10 个项目</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>基础自动化功能</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>5GB 存储空间</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>电子邮件支持</span>
                        </div>
                    </div>
                    <div class="pricing-cta">
                        <a href="#signup" class="btn btn-secondary">开始免费试用</a>
                    </div>
                </div>
                
                <div class="pricing-card popular">
                    <div class="popular-badge">最受欢迎</div>
                    <div class="pricing-header">
                        <h3 class="pricing-name">专业版</h3>
                        <div class="pricing-price">¥199</div>
                        <div class="pricing-period">每用户/月，按年付费</div>
                    </div>
                    <div class="pricing-features">
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>无限项目</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>高级自动化功能</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>50GB 存储空间</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>优先电子邮件和聊天支持</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>高级分析和报告</span>
                        </div>
                    </div>
                    <div class="pricing-cta">
                        <a href="#signup" class="btn btn-primary">开始免费试用</a>
                    </div>
                </div>
                
                <div class="pricing-card">
                    <div class="pricing-header">
                        <h3 class="pricing-name">企业版</h3>
                        <div class="pricing-price">¥399</div>
                        <div class="pricing-period">每用户/月，按年付费</div>
                    </div>
                    <div class="pricing-features">
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>专业版全部功能</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>无限存储空间</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>24/7 专属支持</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>企业级安全和合规</span>
                        </div>
                        <div class="pricing-feature">
                            <i class="ph-check"></i>
                            <span>专属客户成功经理</span>
                        </div>
                    </div>
                    <div class="pricing-cta">
                        <a href="#signup" class="btn btn-secondary">联系销售</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ区域 -->
    <section class="faq" id="faq">
        <div class="container">
            <div class="section-title">
                <h2>常见问题</h2>
                <p>以下是我们最常被问到的一些问题。如果您有其他疑问，请随时联系我们。</p>
            </div>
            
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question" data-faq="1">
                        <span>CloudFlow 是否提供免费试用？</span>
                        <i class="ph-plus"></i>
                    </div>
                    <div class="faq-answer" id="faq-1">
                        <p>是的，我们为所有方案提供 14 天的免费试用，无需信用卡。您可以在试用期间体验所有功能，并决定哪个方案最适合您的团队。</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" data-faq="2">
                        <span>如何将现有数据迁移到 CloudFlow？</span>
                        <i class="ph-plus"></i>
                    </div>
                    <div class="faq-answer" id="faq-2">
                        <p>CloudFlow 提供多种数据导入工具，支持从常见的项目管理工具（如 Asana、Trello、Jira 等）导入数据。我们的支持团队也可以协助您完成迁移过程。</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" data-faq="3">
                        <span>CloudFlow 是否支持移动设备？</span>
                        <i class="ph-plus"></i>
                    </div>
                    <div class="faq-answer" id="faq-3">
                        <p>是的，CloudFlow 提供适用于 iOS 和 Android 的移动应用，您可以随时随地访问和管理您的项目。我们的移动应用具有与网页版相同的核心功能。</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" data-faq="4">
                        <span>我可以随时取消订阅吗？</span>
                        <i class="ph-plus"></i>
                    </div>
                    <div class="faq-answer" id="faq-4">
                        <p>是的，您可以随时取消订阅。如果您在计费周期内取消，您的账户将保持活跃状态直到当前计费周期结束。我们不提供部分退款，但您可以继续使用服务直到计费周期结束。</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" data-faq="5">
                        <span>CloudFlow 的数据安全措施有哪些？</span>
                        <i class="ph-plus"></i>
                    </div>
                    <div class="faq-answer" id="faq-5">
                        <p>CloudFlow 采用多层安全措施保护您的数据，包括 SSL/TLS 加密、定期安全审计、多因素认证、数据备份等。我们符合 GDPR、SOC 2 等多项安全合规标准。</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA区域 -->
    <section class="cta" id="signup">
        <div class="container cta-container">
            <h2>准备好提升您的团队效率了吗？</h2>
            <p>立即注册 14 天免费试用，体验 CloudFlow 如何帮助您的团队更高效地工作。无需信用卡，无隐藏费用。</p>
            <a href="#" class="btn btn-secondary">立即开始免费试用</a>
        </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
        <div class="container">
            <div class="footer-container">
                <div class="footer-about">
                    <a href="#" class="footer-logo">CloudFlow</a>
                    <p>CloudFlow 是一款现代化的 SaaS 解决方案，帮助团队更高效地协作、管理项目和自动化工作流程。</p>
                    <div class="social-links">
                        <a href="#" class="social-link"><i class="ph-twitter-logo"></i></a>
                        <a href="#" class="social-link"><i class="ph-facebook-logo"></i></a>
                        <a href="#" class="social-link"><i class="ph-linkedin-logo"></i></a>
                        <a href="#" class="social-link"><i class="ph-instagram-logo"></i></a>
                    </div>
                </div>
                
                <div class="footer-links-group">
                    <h4 class="footer-heading">产品</h4>
                    <ul class="footer-links">
                        <li><a href="#">功能</a></li>
                        <li><a href="#">定价</a></li>
                        <li><a href="#">集成</a></li>
                        <li><a href="#">路线图</a></li>
                        <li><a href="#">更新日志</a></li>
                    </ul>
                </div>
                
                <div class="footer-links-group">
                    <h4 class="footer-heading">资源</h4>
                    <ul class="footer-links">
                        <li><a href="#">博客</a></li>
                        <li><a href="#">指南</a></li>
                        <li><a href="#">帮助中心</a></li>
                        <li><a href="#">网络研讨会</a></li>
                        <li><a href="#">API 文档</a></li>
                    </ul>
                </div>
                
                <div class="footer-links-group">
                    <h4 class="footer-heading">公司</h4>
                    <ul class="footer-links">
                        <li><a href="#">关于我们</a></li>
                        <li><a href="#">客户案例</a></li>
                        <li><a href="#">招贤纳士</a></li>
                        <li><a href="#">联系我们</a></li>
                        <li><a href="#">合作伙伴</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2023 CloudFlow Inc. 保留所有权利。 <a href="#">隐私政策</a> · <a href="#">服务条款</a> · <a href="#">Cookie 政策</a></p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"></script>
    <script>
        // 导航栏滚动效果
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 移动端菜单
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        // FAQ 折叠面板
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqId = question.getAttribute('data-faq');
                const answer = document.getElementById(\`faq-\${faqId}\`);
                
                question.classList.toggle('active');
                answer.classList.toggle('active');
            });
        });

        // 客户评价轮播
        const testimonialSwiper = new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }
        });

        // 滚动动画
        const animateElements = document.querySelectorAll('.animate');
        
        const observerOptions = {
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    </script>
</body>
</html>`
export {
  MOCK_HTML
}
