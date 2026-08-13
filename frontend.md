<!-- LAST DANCE - Ana Sayfa (Hareketli) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>LAST DANCE | Official Store</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;600&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: 'liga';
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }

        /* Motion Enhancements */
        @keyframes heroEntrance {
            0% { opacity: 0; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        .hero-animate {
            animation: heroEntrance 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .reveal-item {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-item.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .parallax-wrapper {
            display: inline-block;
            transition: transform 0.1s ease-out;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed": "#e2e2e2",
                        "on-error": "#ffffff",
                        "primary-fixed-dim": "#bcc2ff",
                        "error": "#ba1a1a",
                        "surface-container": "#efeded",
                        "on-tertiary-container": "#c7c8c8",
                        "tertiary-fixed-dim": "#c6c6c7",
                        "primary-fixed": "#dfe0ff",
                        "on-primary-container": "#bfc4ff",
                        "surface-tint": "#273fff",
                        "secondary-container": "#e2e2e2",
                        "secondary-fixed": "#e2e2e2",
                        "surface-bright": "#faf9f9",
                        "on-secondary": "#ffffff",
                        "on-tertiary-fixed-variant": "#454747",
                        "surface": "#faf9f9",
                        "on-surface": "#1b1c1c",
                        "surface-variant": "#e3e2e2",
                        "on-secondary-fixed": "#1b1b1b",
                        "inverse-primary": "#bcc2ff",
                        "inverse-surface": "#303031",
                        "surface-container-highest": "#e3e2e2",
                        "on-secondary-container": "#646464",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f5f3f3",
                        "outline": "#757689",
                        "background": "#faf9f9",
                        "surface-container-high": "#e9e8e8",
                        "on-primary-fixed": "#000a64",
                        "secondary-fixed-dim": "#c6c6c6",
                        "inverse-on-surface": "#f2f0f0",
                        "primary-container": "#0029ff",
                        "error-container": "#ffdad6",
                        "on-tertiary-fixed": "#1a1c1c",
                        "on-error-container": "#93000a",
                        "tertiary": "#3b3d3d",
                        "on-surface-variant": "#444557",
                        "on-background": "#1b1c1c",
                        "on-secondary-fixed-variant": "#474747",
                        "on-primary-fixed-variant": "#0022db",
                        "surface-dim": "#dbdad9",
                        "on-primary": "#ffffff",
                        "primary": "#001cbf",
                        "on-tertiary": "#ffffff",
                        "outline-variant": "#c5c5da",
                        "secondary": "#5e5e5e",
                        "tertiary-container": "#525454"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "stack-sm": "8px",
                        "stack-md": "24px",
                        "stack-lg": "48px",
                        "margin-mobile": "20px",
                        "container-max": "1440px",
                        "margin-desktop": "64px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "label-mono": [
                            "JetBrains Mono"
                        ],
                        "body-lg": [
                            "Geist"
                        ],
                        "headline-lg-mobile": [
                            "Anton"
                        ],
                        "headline-lg": [
                            "Anton"
                        ],
                        "display-lg": [
                            "Anton"
                        ],
                        "body-md": [
                            "Geist"
                        ],
                        "headline-md": [
                            "Anton"
                        ]
                    },
                    "fontSize": {
                        "label-mono": [
                            "12px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "0.1em",
                                "fontWeight": "500"
                            }
                        ],
                        "body-lg": [
                            "18px",
                            {
                                "lineHeight": "160%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg-mobile": [
                            "32px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg": [
                            "48px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "display-lg": [
                            "96px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "400"
                            }
                        ],
                        "body-md": [
                            "16px",
                            {
                                "lineHeight": "150%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-md": [
                            "24px",
                            {
                                "lineHeight": "120%",
                                "fontWeight": "400"
                            }
                        ]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-surface text-on-surface font-body-md antialiased selection:bg-primary selection:text-on-primary">
<!-- TopNavBar -->
<nav class="bg-surface dark:bg-surface w-full top-0 sticky z-50 border-b border-on-surface dark:border-outline flat no shadows">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
<!-- Brand Logo -->
<a class="font-headline-md text-headline-md uppercase text-on-surface dark:text-inverse-on-surface tracking-tighter scale-95 transition-transform duration-150 flex items-center gap-2" href="#">
<img alt="LAST DANCE Logo" class="h-10 w-10 object-contain rounded-DEFAULT" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA"/>
                LAST DANCE
            </a>
<!-- Navigation Links (Web) -->
<div class="hidden md:flex items-center gap-stack-md font-headline-md text-headline-md uppercase">
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1 scale-95 transition-transform duration-150" href="#">New Arrivals</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors dark:hover:text-primary-fixed-dim scale-95 hover:scale-100 transition-all duration-150" href="#">Collections</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors dark:hover:text-primary-fixed-dim scale-95 hover:scale-100 transition-all duration-150" href="#">Accessories</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors dark:hover:text-primary-fixed-dim scale-95 hover:scale-100 transition-all duration-150" href="#">Archive</a>
</div>
<!-- Trailing Icons -->
<div class="flex items-center gap-stack-sm text-primary dark:text-primary-fixed-dim">
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 hover:scale-100 duration-150 p-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">search</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 hover:scale-100 duration-150 p-2 hidden md:block">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">person</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 hover:scale-100 duration-150 p-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shopping_bag</span>
</button>
</div>
</div>
</nav>
<!-- Main Canvas -->
<main class="w-full max-w-container-max mx-auto">
<!-- Hero Section -->
<section class="w-full border-b border-on-surface mb-stack-lg">
<div class="grid grid-cols-1 md:grid-cols-12 min-h-[70vh]">
<!-- Hero Text -->
<div class="col-span-1 md:col-span-5 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-stack-lg md:py-0 border-b md:border-b-0 md:border-r border-on-surface">
<h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase mb-stack-sm text-on-surface">
                        The<br/>Final<br/>Drop.
                    </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-md max-w-md">
                        Unapologetic streetwear. Brutalist design. This is your last chance to secure the archive.
                    </p>
<div class="flex gap-4">
<a class="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary transition-colors duration-200 hover:-translate-y-1 transform" href="#">
                            Shop Now
                        </a>
</div>
</div>
<!-- Hero Image -->
<div class="col-span-1 md:col-span-7 bg-surface-container relative overflow-hidden group min-h-[50vh] md:min-h-full hero-animate" data-alt="A highly stylized editorial shot of a model wearing a heavy black streetwear hoodie in a stark, brutalist concrete environment. High contrast lighting with harsh shadows. The mood is edgy, urban, and uncompromising, fitting a premium streetwear brand aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzMh6fRDfkSM3SNPiL7576E0rv7YSo_zMVFQMFZs9t5_Nk63qNYz_KlomIWfL-_2IkmpIqnBcDYxxZpRcu0piF3HuW4xPdzeD8SR15ehP4HjEflckOZSbSDku1Rk5sJ8_vs8wzddf3DezYdfAywmYW1wdRwdWqaomM-Dsf1cx6K0OGj527Nzw6FJuiRxK1VT_Z_th-R5oS4tq5rR8mKIBSTsQGwIh6oRKUT7ASzCWaMQ5DLEMl25lKsA'); background-size: cover; background-position: center;">
<div class="absolute bottom-stack-md right-stack-md bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
                        Campaign 001
                    </div>
</div>
</div>
</section>
<!-- New Arrivals Grid -->
<section class="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg">
<div class="flex justify-between items-end mb-stack-md border-b border-on-surface pb-stack-sm overflow-hidden">
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface parallax-wrapper">New Arrivals</h2>
<a class="font-label-mono text-label-mono uppercase text-on-surface hover:text-primary transition-colors" href="#">View All</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-on-surface">
<!-- Product 1 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-all duration-300 hover:shadow-lg hover:-translate-y-1 reveal-item cursor-pointer">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" data-alt="A stark product shot of a premium, heavy-weight black hoodie featuring a bold, minimalist white geometric graphic on the chest." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3dP2AQM_V5Z8VRogQhzfJnqbg_ID1F0CtA-Ww1OMOKzrpguIGavduJfIbhJqPbTu3W5oAIXHBkm71oYYdbbU63Q-zppWE-55ZDNtL2Au_6a3xCUWoF6ErqfjxKF3O1b7-RNBzeqpkgkAnLsUbKUKYo7zPYUZfA3AR17yj4URFWX25iEEMvwU-rHiTvbduBM1M0ky1j_IoPOaNuKVtfyP9uE1ZYfyvY96LzexWkNsnhdRs0Z_9MJ96uw"/>
<div class="absolute top-4 left-4 bg-primary text-on-primary font-label-mono text-label-mono px-2 py-1">NEW</div>
</div>
<div class="p-4 flex flex-col gap-2 relative">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Core Black Hoodie</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€89,00</div>
<div class="flex gap-2 mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute right-4 bottom-4">
<div class="w-4 h-4 rounded-full bg-black border border-outline"></div>
<div class="w-4 h-4 rounded-full bg-surface border border-outline"></div>
</div>
</div>
</div>
<!-- Product 2 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-all duration-300 hover:shadow-lg hover:-translate-y-1 reveal-item cursor-pointer">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" data-alt="A stark product shot of a premium, heavy-weight crimson red hoodie featuring a bold, minimalist white geometric graphic on the chest." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOUJh1fyy5UJKM6Fqf-hjv96law3DjMRpvXL5Es8Q5sMRXdxdlEaK-rWVMEmeWAywi6SVbamZohAnBuR1PKDZyr7TAmTdrS7k6uzOpO_goLXoiGdrifCjmOnM5AwPa_O1Kz59W-KkXlpyMu4L5eUPXVhv641RzcENwLrDLspNiDLG9zqLY75gvfEEfYA3NjIbChNajDhW0Hm1HLlmP0xJX8V7CkeAa1vM81AHAsHNx7Ehtp_xxGbrBtA"/>
</div>
<div class="p-4 flex flex-col gap-2 relative">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Core Red Hoodie</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€89,00</div>
<div class="flex gap-2 mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute right-4 bottom-4">
<div class="w-4 h-4 rounded-full bg-red-600 border border-outline"></div>
<div class="w-4 h-4 rounded-full bg-black border border-outline"></div>
</div>
</div>
</div>
<!-- Product 3 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-all duration-300 hover:shadow-lg hover:-translate-y-1 reveal-item cursor-pointer">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" data-alt="A stark product shot of a premium, heavy-weight crisp white hoodie featuring a bold, grey arched text graphic on the chest." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7TfBzjZHRirMOVmD1f-CYdaRy2mK5kCjW_nQeo38S6DEqVZgQ-N1uoo5CUmPzsVWrm9hBIR4A9r1Cf5L6XDgDaFr1tWvL9FaJ9MeTB9PgAS0QQkNMoikaBP14QgLNSGDzUunliGYY52fGW11GhNn8JRQqAgja98O3pg-KUWQqZ5dFGZiOmcag1Z7cCjUKXmtJSfcQ221ffZwquMd7sN6DXh3yssZgfpe0R2thjmr8FM4SYzALVlmgw"/>
<div class="absolute top-4 left-4 bg-tertiary text-on-tertiary font-label-mono text-label-mono px-2 py-1">LIMITED</div>
</div>
<div class="p-4 flex flex-col gap-2 relative">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Arch Logo White</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€95,00</div>
<div class="flex gap-2 mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute right-4 bottom-4">
<div class="w-4 h-4 rounded-full bg-surface border border-outline"></div>
</div>
</div>
</div>
</div>
</section>
<!-- Bento Grid Collections -->
<section class="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg">
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface mb-stack-md border-b border-on-surface pb-stack-sm">Collections</h2>
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter grid-rows-[auto]">
<!-- Large Feature -->
<a class="col-span-1 md:col-span-8 group relative block overflow-hidden border border-on-surface min-h-[400px] md:min-h-[600px] reveal-item" href="#">
<div class="absolute inset-0 bg-surface-container transition-transform duration-1000 group-hover:scale-110" data-alt="A wide architectural shot of an abandoned industrial warehouse interior. Soft, natural light streams in through broken skylights, illuminating dust motes. In the center, a solitary figure wearing a voluminous black jacket stands motionless. Brutalist, melancholic streetwear vibe." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAMIp_yrl2i-ZHVyakQtSbRFeoOiDQ0j9t_rBf3WNsNKJRLkgvlvj1FJIlZ7ngVxB6u2OGBwaRf0ibRmh69U9aqqqaqnCa6IDLJumLKB7iOpQ1cMQvirZdpyNd5b2-H9Ckdf5VnJu36jq6Sgk1ocE5opopnS9e_HtUJ0jMEIgNHqp20S43JBcg8nDDIoxFO6X2iwK850ijwY21x2DT3FGU_LH-tgVxq2gdblsbd-BLaPZ8E-3UEdm18g'); background-size: cover; background-position: center;"></div>
<div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
<div class="absolute bottom-0 left-0 p-stack-md w-full flex justify-between items-end">
<h3 class="font-headline-md text-headline-lg-mobile md:text-headline-lg uppercase text-surface leading-none transform group-hover:translate-x-2 transition-transform duration-500">The<br/>Industrial<br/>Complex</h3>
<div class="bg-surface text-on-surface font-label-mono text-label-mono px-4 py-2 uppercase border border-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">Explore</div>
</div>
</a>
<!-- Side Stack -->
<div class="col-span-1 md:col-span-4 flex flex-col gap-gutter">
<!-- Top Side -->
<a class="group relative block overflow-hidden border border-on-surface flex-1 min-h-[250px] reveal-item" href="#">
<div class="absolute inset-0 bg-surface-container transition-transform duration-1000 group-hover:scale-110" data-alt="A tight, detailed macro shot of heavy black denim fabric. Focus is on thick, rugged silver hardware, a chunky zipper, and contrasting white stitching. The texture is rough and premium. Urban utilitarian aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuASnUWsYNAroqTBuH6A_t1IQGwwV9H4r14hGP2L49UBGcte9_rXbmGG564jczunWWH7_vMW5LLh6mLV3pQXDyCMTEKVcbOsXU2SfcYhVfBV_LEI6d4C1Imonk-UpKfz_--XKS7D_xYmeekHrUuaaZ0obCejOrKTyUgiJEjaCSU1gYGlTLenYFiusIi26HMLExJObqQ_Ws0K96NiWOis9T-uiaQLtDRyqBsYHn84fsqP_gRokLd-kzMyrg'); background-size: cover; background-position: center;"></div>
<div class="absolute top-0 left-0 p-4 bg-surface text-on-surface border-r border-b border-on-surface font-label-mono text-label-mono uppercase group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">Heavyweight</div>
</a>
<!-- Bottom Side -->
<div class="bg-on-surface text-surface flex-1 p-stack-md flex flex-col justify-center border border-on-surface min-h-[250px] reveal-item">
<h4 class="font-headline-md text-headline-md uppercase mb-4">Join the Syndicate</h4>
<p class="font-label-mono text-label-mono text-surface-variant mb-6">Exclusive access to limited drops before they hit the main grid.</p>
<form class="flex w-full border-b border-surface pb-2 group focus-within:border-primary transition-colors">
<input class="bg-transparent w-full font-label-mono text-label-mono text-surface placeholder:text-surface-variant focus:outline-none focus:ring-0 border-none p-0 transition-all duration-300" placeholder="EMAIL ADDRESS" type="email"/>
<button class="text-surface group-focus-within:text-primary transition-colors hover:translate-x-1 transform duration-300" type="button">
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</form>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-on-surface dark:bg-surface-container-lowest w-full mt-stack-lg border-t border-on-surface flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
<!-- Brand -->
<div class="flex flex-col gap-stack-sm w-full md:w-auto">
<span class="font-headline-md text-headline-md text-surface dark:text-on-surface uppercase tracking-tighter">LAST DANCE</span>
<span class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant">© 2024 LAST DANCE. ALL RIGHTS RESERVED.</span>
</div>
<!-- Links -->
<div class="flex flex-wrap md:flex-nowrap gap-stack-md font-label-mono text-label-mono uppercase w-full md:w-auto mt-stack-md md:mt-0">
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-all hover:-translate-y-1 transform duration-200 opacity-80 hover:opacity-100" href="#">Newsletter</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-all hover:-translate-y-1 transform duration-200 opacity-80 hover:opacity-100" href="#">Shipping</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-all hover:-translate-y-1 transform duration-200 opacity-80 hover:opacity-100" href="#">Returns</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-all hover:-translate-y-1 transform duration-200 opacity-80 hover:opacity-100" href="#">Terms</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-all hover:-translate-y-1 transform duration-200 opacity-80 hover:opacity-100" href="#">Contact</a>
</div>
</div>
</footer>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Scroll Reveal
        const revealItems = document.querySelectorAll('.reveal-item');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Stagger grid items if they appear at the same time
        const gridItems = Array.from(document.querySelectorAll('.grid > .reveal-item'));
        gridItems.forEach((item, index) => {
            item.style.transitionDelay = `${(index % 3) * 100}ms`;
        });

        revealItems.forEach(item => revealObserver.observe(item));

        // Parallax Text Effect
        const parallaxElements = document.querySelectorAll('.parallax-wrapper');
        
        const animateParallax = () => {
            parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                
                // Only animate if in or near viewport
                if (rect.top <= viewHeight && rect.bottom >= 0) {
                    // Calculate offset relative to viewport position
                    const scrollOffset = (viewHeight - rect.top) * -0.05; 
                    el.style.transform = `translateY(${scrollOffset}px)`;
                }
            });
            requestAnimationFrame(animateParallax);
        };
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(animateParallax);
        });
    });
</script>
</body></html>

<!-- LAST DANCE - Ürün Detayı -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>LAST DANCE - Signature Hoodie</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;600&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-fixed": "#e2e2e2",
                      "on-error": "#ffffff",
                      "primary-fixed-dim": "#bcc2ff",
                      "error": "#ba1a1a",
                      "surface-container": "#efeded",
                      "on-tertiary-container": "#c7c8c8",
                      "tertiary-fixed-dim": "#c6c6c7",
                      "primary-fixed": "#dfe0ff",
                      "on-primary-container": "#bfc4ff",
                      "surface-tint": "#273fff",
                      "secondary-container": "#e2e2e2",
                      "secondary-fixed": "#e2e2e2",
                      "surface-bright": "#faf9f9",
                      "on-secondary": "#ffffff",
                      "on-tertiary-fixed-variant": "#454747",
                      "surface": "#faf9f9",
                      "on-surface": "#1b1c1c",
                      "surface-variant": "#e3e2e2",
                      "on-secondary-fixed": "#1b1b1b",
                      "inverse-primary": "#bcc2ff",
                      "inverse-surface": "#303031",
                      "surface-container-highest": "#e3e2e2",
                      "on-secondary-container": "#646464",
                      "surface-container-lowest": "#ffffff",
                      "surface-container-low": "#f5f3f3",
                      "outline": "#757689",
                      "background": "#faf9f9",
                      "surface-container-high": "#e9e8e8",
                      "on-primary-fixed": "#000a64",
                      "secondary-fixed-dim": "#c6c6c6",
                      "inverse-on-surface": "#f2f0f0",
                      "primary-container": "#0029ff",
                      "error-container": "#ffdad6",
                      "on-tertiary-fixed": "#1a1c1c",
                      "on-error-container": "#93000a",
                      "tertiary": "#3b3d3d",
                      "on-surface-variant": "#444557",
                      "on-background": "#1b1c1c",
                      "on-secondary-fixed-variant": "#474747",
                      "on-primary-fixed-variant": "#0022db",
                      "surface-dim": "#dbdad9",
                      "on-primary": "#ffffff",
                      "primary": "#001cbf",
                      "on-tertiary": "#ffffff",
                      "outline-variant": "#c5c5da",
                      "secondary": "#5e5e5e",
                      "tertiary-container": "#525454"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "stack-sm": "8px",
                      "stack-md": "24px",
                      "stack-lg": "48px",
                      "margin-mobile": "20px",
                      "container-max": "1440px",
                      "margin-desktop": "64px",
                      "gutter": "24px"
              },
              "fontFamily": {
                      "label-mono": [
                              "JetBrains Mono"
                      ],
                      "body-lg": [
                              "Geist"
                      ],
                      "headline-lg-mobile": [
                              "Anton"
                      ],
                      "headline-lg": [
                              "Anton"
                      ],
                      "display-lg": [
                              "Anton"
                      ],
                      "body-md": [
                              "Geist"
                      ],
                      "headline-md": [
                              "Anton"
                      ]
              },
              "fontSize": {
                      "label-mono": [
                              "12px",
                              {
                                      "lineHeight": "100%",
                                      "letterSpacing": "0.1em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "160%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "110%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "48px",
                              {
                                      "lineHeight": "110%",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-lg": [
                              "96px",
                              {
                                      "lineHeight": "100%",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "150%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "120%",
                                      "fontWeight": "400"
                              }
                      ]
              }
      },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1;
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
<!-- TopNavBar -->
<header class="bg-surface dark:bg-surface text-primary dark:text-primary-fixed-dim font-headline-md text-headline-md uppercase w-full top-0 sticky z-50 border-b border-on-surface dark:border-outline flat no shadows">
<div class="flex justify-between items-center w-full px-margin-desktop py-stack-sm max-w-container-max mx-auto">
<div class="flex items-center gap-gutter">
<a class="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface tracking-tighter hover:scale-95 transition-transform duration-150 flex items-center" href="#">
<img alt="LAST DANCE Logo" class="h-12 w-auto mr-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA"/>
                    LAST DANCE
                </a>
</div>
<!-- Desktop Navigation -->
<nav class="hidden md:flex gap-gutter items-center">
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">New Arrivals</a>
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1 hover:scale-95 transition-transform duration-150" href="#">Collections</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">Accessories</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">Archive</a>
</nav>
<div class="flex gap-stack-md items-center">
<button aria-label="Search" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<button aria-label="Profile" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="person">person</span>
</button>
<button aria-label="Shopping Bag" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</button>
<!-- Mobile Menu Toggle -->
<button aria-label="Menu" class="md:hidden hover:text-primary transition-colors hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</div>
</div>
</header>
<main class="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
<!-- Product Main Section -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg border border-on-surface">
<!-- Image Gallery (Spans 7 cols on Desktop) -->
<div class="md:col-span-7 border-b md:border-b-0 md:border-r border-on-surface flex flex-col">
<div class="w-full relative bg-surface-container aspect-square">
<img class="w-full h-full object-cover" data-alt="A high-fashion, editorial style photograph of a heavy black oversized hoodie floating in a stark white minimalist studio. Harsh, high-contrast lighting creates strong shadows. A subtle electric blue gel light hits the edge of the fabric. The aesthetic is brutalist and raw streetwear." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnZn2hKV3hLa8sRrNt84IVuEm_J4k3MfYkvE49CqLhJHYhhBrbdyOisiuducSVWJHbo0Q07oA72fk08Qduvd8R6vnDl0hZJU3VPgt-nDk-KAFWJxpC6JQw6TJndregxSNVso0Ec_ChS79VebdTu7Y00SggO-32G5vFr4W1CMuuF5a46JnVQCB30uvpBld-rbTuXBVm94CWx7L4yVwlv7O01HWlGuPdsCH2-A48-Z8WaSt1AzgmnLp37g"/>
<div class="absolute top-stack-sm left-stack-sm bg-primary text-on-primary font-label-mono text-label-mono px-2 py-1">
                        LIMITED DROP
                    </div>
</div>
<!-- Thumbnail Grid -->
<div class="grid grid-cols-3 border-t border-on-surface">
<div class="aspect-square border-r border-on-surface cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
<img class="w-full h-full object-cover" data-alt="Close up detailed macro shot of heavy black cotton fabric texture on a streetwear hoodie. Minimalist lighting, stark contrast, showcasing the premium quality and heavy weight of the material in a stark white studio setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjajoyBu3ad7zOyLM8lGvh8a1PvLohKUV8XmV_NjnTUgq9-krsU2EW81KcKJhtAUSAdL1JLV3HE6EFDziwL9tFPXVw_Gg232OmD4G2x18zHo7tj0SfzlBKof24Q4AKhaQXUFH7Ytw9gUiU--uaz4aQjUBCpVmUU-WvViDxH4kfYxqKs5VRwCRnEQj8CSaDLYSZQ2BQ13_Pztrj2yaIwOcFGtdKzYs1HoNNFMb7R8Jl_SCj2g-jwjW5bQ"/>
</div>
<div class="aspect-square border-r border-on-surface cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
<img class="w-full h-full object-cover" data-alt="Close up shot of the back of a black oversized streetwear hoodie featuring a large, abstract architectural graphic printed in crisp white ink. High contrast lighting in a minimalist gallery setting. Raw, brutalist vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6D6XoYsYiBhS9iVvTyQDvzr6RWgqPJ12Mobp1lDtsMEQX8eswjwpV5ID1iXdPUroWI5pli_lS0CZ8JWITVlcm-WLSXUiXy7hDbUTwFGMDWpMSbsMBp4A83dz8-REmeVUo7BRBtaU24sSoT5hdPsenDLumUIDL_sYu2hfKuMAOjtzOY0U7_sXqDqfACFlgdli4CBPrZ5F0Q3zzwt4ovUfU2pn6O8ZkRuLJASRX4f32eouEFTtC_U_pKQ"/>
</div>
<div class="aspect-square cursor-pointer hover:opacity-80 transition-opacity bg-surface-container">
<img class="w-full h-full object-cover" data-alt="Detail shot of the chunky metal zipper and thick drawstrings on a premium black streetwear hoodie. Stark white background, sharp focus, industrial and high-end streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqGrJVo09iww319Jz0Xg7CGSSwLgm69TyFmEm0MeIDGD40HkiRPioQaYrmlPpG8KWv9G0vpj7rwoU9aGYo5PleHKlgxjZjcAhraf5nDYq95uMshC8giMM3VZ8JQL2CkQtGsxUSbNrJg9DZItZrBIuIu3IkeZhSnN2HvXbPJVVfnfabMQ-T3oNZdBySAnc8X5O_cCX3aSM8MRMKzTzag12TaHesr5u0FZqR5WrWXsDmjDWTmGCXv49txA"/>
</div>
</div>
</div>
<!-- Product Info (Spans 5 cols on Desktop) -->
<div class="md:col-span-5 flex flex-col p-stack-md md:p-stack-lg justify-between">
<div>
<div class="font-label-mono text-label-mono text-outline uppercase mb-2">LAST DANCE // HEAVYWEIGHT</div>
<h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase leading-none mb-stack-sm tracking-tight">
                        SIGNATURE<br/>HOODIE.01
                    </h1>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 mb-stack-md">
                        € 149,00
                    </div>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
                        The definitive silhouette. Engineered from 600GSM organic cotton. Oversized architectural fit with dropped shoulders and an exaggerated hood. Built for the modern urban environment.
                    </p>
<!-- Form / Selectors -->
<div class="mb-stack-lg">
<div class="flex justify-between items-center mb-2">
<span class="font-label-mono text-label-mono uppercase">Size</span>
<a class="font-label-mono text-label-mono text-primary hover:underline" href="#">Size Guide</a>
</div>
<div class="flex gap-2 flex-wrap">
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors bg-on-surface text-surface">S</button>
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">M</button>
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">L</button>
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">XL</button>
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono text-outline line-through cursor-not-allowed">XXL</button>
</div>
</div>
</div>
<div class="flex flex-col gap-stack-sm">
<button class="w-full bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                        Add to Bag
                        <span class="material-symbols-outlined icon-fill text-[24px]">shopping_bag</span>
</button>
<button class="w-full border border-on-surface bg-transparent text-on-surface font-headline-md text-headline-md uppercase py-4 hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                        Mit <span class="font-bold text-primary">shop</span> kaufen
                    </button>
<div class="text-center mt-2">
<a class="font-label-mono text-label-mono underline text-outline hover:text-on-surface" href="#">Weitere Bezahlmöglichkeiten</a>
</div>
</div>
</div>
</div>
<!-- Style With Section -->
<section class="mt-stack-lg pt-stack-lg border-t border-on-surface">
<h2 class="font-headline-md text-headline-md uppercase mb-stack-md tracking-tight">Complete the Look</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Recommended Product 1 -->
<div class="group border border-on-surface">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Wide fit black cargo pants shown in a stark white studio environment. High contrast lighting highlighting the structured fabric and utilitarian pockets. Brutalist streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFbG5w_EMdbmpU3cECQWl2EPC265LIYvGuCa6hdFfDRAv4yhW4rOi2kgrtVHANoiqQlqebch-KWWfTwGqLiCFc8_xlFY57CP4Kp2X9C0H833FZGXOgEoJj4emdzIWjYCQLr2IgtCVHlix9KV3rATi7K6DfiYxxYSKM-BnYTwPJF6lJTh40cu11g8avnrSArRgg1VVzccJH7C89B3aY6JSldsHuOqhsPO8V6dXFAExYOdr-j1Kx2nT_XQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Utility Cargo</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Bottoms</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 120
                        </div>
</div>
</div>
<!-- Recommended Product 2 -->
<div class="group border border-on-surface">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Chunky black minimalist sneakers shot from a low angle in a pristine white studio. High key lighting emphasizing the geometric, architectural sole design. High-end streetwear vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc8YvXzn5aC86GxLlzHHITBX5LzBOgqSHdrqcXR93c96Y296NUYAPBnD7LLEaK9OMDRpJ415LUEmKVMi8F3uKlfLtXQ3bF_dGEUADWkGjPVpjGvl9uMJYvgv8JGy086u7c6b0FP3XxBavTkNrwP4VNp68zwN4OOx2saYWYPkoKF-xAj2vGTkVwL2T-e9MfyuHwnGn70IUwWR6vQxChnnGC4US94kPHcjHl3FNaaETiRbC3FtTreaztiQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Block Runner</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Footwear</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 250
                        </div>
</div>
</div>
<!-- Recommended Product 3 -->
<div class="group border border-on-surface hidden md:block">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A sleek, minimalist black crossbody bag with heavy metal hardware. Shot against a white backdrop with sharp, dramatic shadows. Technical streetwear accessory." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCViaENUEUKm1W_oB43vGLOEnwkjxuIygqbHvF7BtQfzZJQDBwCMvvFrd_dEZVsn4wLpNNVFyzlhlrdL-x4wNMZpM1CrvmX2wcWYOA31Uwv-TUJ1IHRVFcANddkpwkttiOO_toxBJF35hpamo17cc-4JJQorAu3S0-whTIR_VPFoia86InbgdZXQQWo88C0u2m9-DVGSpREqng9rFVUa3Z_ulACuR98c-6ThggMvZoL_TByNiwA87Y_GQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Tech Pouch</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Accessories</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 65
                        </div>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-on-surface dark:bg-surface-container-lowest text-surface dark:text-on-surface font-label-mono text-label-mono uppercase w-full mt-stack-lg border-t border-on-surface flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-desktop py-stack-lg gap-gutter">
<div class="font-headline-md text-headline-md text-surface dark:text-on-surface mb-stack-md md:mb-0">
                LAST DANCE
            </div>
<nav class="flex flex-wrap gap-stack-md mb-stack-md md:mb-0">
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Newsletter</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Shipping</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Returns</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
</nav>
<div class="text-surface-variant dark:text-on-surface-variant">
                © 2024 LAST DANCE. ALL RIGHTS RESERVED.
            </div>
</div>
</footer>
</body></html>

<!-- LAST DANCE - Ürün Detayı (Hareketli) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>LAST DANCE - Signature Hoodie</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;600&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "tertiary-fixed": "#e2e2e2",
                      "on-error": "#ffffff",
                      "primary-fixed-dim": "#bcc2ff",
                      "error": "#ba1a1a",
                      "surface-container": "#efeded",
                      "on-tertiary-container": "#c7c8c8",
                      "tertiary-fixed-dim": "#c6c6c7",
                      "primary-fixed": "#dfe0ff",
                      "on-primary-container": "#bfc4ff",
                      "surface-tint": "#273fff",
                      "secondary-container": "#e2e2e2",
                      "secondary-fixed": "#e2e2e2",
                      "surface-bright": "#faf9f9",
                      "on-secondary": "#ffffff",
                      "on-tertiary-fixed-variant": "#454747",
                      "surface": "#faf9f9",
                      "on-surface": "#1b1c1c",
                      "surface-variant": "#e3e2e2",
                      "on-secondary-fixed": "#1b1b1b",
                      "inverse-primary": "#bcc2ff",
                      "inverse-surface": "#303031",
                      "surface-container-highest": "#e3e2e2",
                      "on-secondary-container": "#646464",
                      "surface-container-lowest": "#ffffff",
                      "surface-container-low": "#f5f3f3",
                      "outline": "#757689",
                      "background": "#faf9f9",
                      "surface-container-high": "#e9e8e8",
                      "on-primary-fixed": "#000a64",
                      "secondary-fixed-dim": "#c6c6c6",
                      "inverse-on-surface": "#f2f0f0",
                      "primary-container": "#0029ff",
                      "error-container": "#ffdad6",
                      "on-tertiary-fixed": "#1a1c1c",
                      "on-error-container": "#93000a",
                      "tertiary": "#3b3d3d",
                      "on-surface-variant": "#444557",
                      "on-background": "#1b1c1c",
                      "on-secondary-fixed-variant": "#474747",
                      "on-primary-fixed-variant": "#0022db",
                      "surface-dim": "#dbdad9",
                      "on-primary": "#ffffff",
                      "primary": "#001cbf",
                      "on-tertiary": "#ffffff",
                      "outline-variant": "#c5c5da",
                      "secondary": "#5e5e5e",
                      "tertiary-container": "#525454"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "stack-sm": "8px",
                      "stack-md": "24px",
                      "stack-lg": "48px",
                      "margin-mobile": "20px",
                      "container-max": "1440px",
                      "margin-desktop": "64px",
                      "gutter": "24px"
              },
              "fontFamily": {
                      "label-mono": [
                              "JetBrains Mono"
                      ],
                      "body-lg": [
                              "Geist"
                      ],
                      "headline-lg-mobile": [
                              "Anton"
                      ],
                      "headline-lg": [
                              "Anton"
                      ],
                      "display-lg": [
                              "Anton"
                      ],
                      "body-md": [
                              "Geist"
                      ],
                      "headline-md": [
                              "Anton"
                      ]
              },
              "fontSize": {
                      "label-mono": [
                              "12px",
                              {
                                      "lineHeight": "100%",
                                      "letterSpacing": "0.1em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "160%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "110%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "48px",
                              {
                                      "lineHeight": "110%",
                                      "fontWeight": "400"
                              }
                      ],
                      "display-lg": [
                              "96px",
                              {
                                      "lineHeight": "100%",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "150%",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "120%",
                                      "fontWeight": "400"
                              }
                      ]
              }
      },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1;
        }
        
        /* Custom Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            opacity: 0;
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        
        /* Fluid Image Transition */
        #main-image {
            transition: opacity 0.4s ease-in-out, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .image-changing {
            opacity: 0;
            transform: scale(0.98);
        }
        
        /* Button Pop Animation */
        @keyframes popIn {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        .animate-pop {
            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* Size Button Transitions */
        .size-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .size-btn.active {
            background-color: var(--color-on-surface, #1b1c1c);
            color: var(--color-surface, #faf9f9);
            transform: scale(1.05);
            border-color: var(--color-on-surface, #1b1c1c);
        }
    </style>
</head>
<body class="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
<!-- TopNavBar -->
<header class="bg-surface dark:bg-surface text-primary dark:text-primary-fixed-dim font-headline-md text-headline-md uppercase w-full top-0 sticky z-50 border-b border-on-surface dark:border-outline flat no shadows">
<div class="flex justify-between items-center w-full px-margin-desktop py-stack-sm max-w-container-max mx-auto">
<div class="flex items-center gap-gutter">
<a class="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface tracking-tighter hover:scale-95 transition-transform duration-150 flex items-center" href="#">
<img alt="LAST DANCE Logo" class="h-12 w-auto mr-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA"/>
                    LAST DANCE
                </a>
</div>
<!-- Desktop Navigation -->
<nav class="hidden md:flex gap-gutter items-center">
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">New Arrivals</a>
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1 hover:scale-95 transition-transform duration-150" href="#">Collections</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">Accessories</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:scale-95 transition-transform duration-150 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">Archive</a>
</nav>
<div class="flex gap-stack-md items-center">
<button aria-label="Search" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<button aria-label="Profile" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="person">person</span>
</button>
<button aria-label="Shopping Bag" class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</button>
<!-- Mobile Menu Toggle -->
<button aria-label="Menu" class="md:hidden hover:text-primary transition-colors hover:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</div>
</div>
</header>
<main class="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
<!-- Product Main Section -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg border border-on-surface animate-fade-in-up">
<!-- Image Gallery (Spans 7 cols on Desktop) -->
<div class="md:col-span-7 border-b md:border-b-0 md:border-r border-on-surface flex flex-col">
<div class="w-full relative bg-surface-container aspect-square overflow-hidden">
<img class="w-full h-full object-cover origin-center" data-alt="A high-fashion, editorial style photograph of a heavy black oversized hoodie floating in a stark white minimalist studio. Harsh, high-contrast lighting creates strong shadows. A subtle electric blue gel light hits the edge of the fabric. The aesthetic is brutalist and raw streetwear." id="main-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnZn2hKV3hLa8sRrNt84IVuEm_J4k3MfYkvE49CqLhJHYhhBrbdyOisiuducSVWJHbo0Q07oA72fk08Qduvd8R6vnDl0hZJU3VPgt-nDk-KAFWJxpC6JQw6TJndregxSNVso0Ec_ChS79VebdTu7Y00SggO-32G5vFr4W1CMuuF5a46JnVQCB30uvpBld-rbTuXBVm94CWx7L4yVwlv7O01HWlGuPdsCH2-A48-Z8WaSt1AzgmnLp37g"/>
<div class="absolute top-stack-sm left-stack-sm bg-primary text-on-primary font-label-mono text-label-mono px-2 py-1">
                        LIMITED DROP
                    </div>
</div>
<!-- Thumbnail Grid -->
<div class="grid grid-cols-3 border-t border-on-surface">
<div class="aspect-square border-r border-on-surface cursor-pointer hover:opacity-80 transition-opacity bg-surface-container thumb-btn" data-src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjajoyBu3ad7zOyLM8lGvh8a1PvLohKUV8XmV_NjnTUgq9-krsU2EW81KcKJhtAUSAdL1JLV3HE6EFDziwL9tFPXVw_Gg232OmD4G2x18zHo7tj0SfzlBKof24Q4AKhaQXUFH7Ytw9gUiU--uaz4aQjUBCpVmUU-WvViDxH4kfYxqKs5VRwCRnEQj8CSaDLYSZQ2BQ13_Pztrj2yaIwOcFGtdKzYs1HoNNFMb7R8Jl_SCj2g-jwjW5bQ">
<img class="w-full h-full object-cover" data-alt="Close up detailed macro shot of heavy black cotton fabric texture on a streetwear hoodie. Minimalist lighting, stark contrast, showcasing the premium quality and heavy weight of the material in a stark white studio setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjajoyBu3ad7zOyLM8lGvh8a1PvLohKUV8XmV_NjnTUgq9-krsU2EW81KcKJhtAUSAdL1JLV3HE6EFDziwL9tFPXVw_Gg232OmD4G2x18zHo7tj0SfzlBKof24Q4AKhaQXUFH7Ytw9gUiU--uaz4aQjUBCpVmUU-WvViDxH4kfYxqKs5VRwCRnEQj8CSaDLYSZQ2BQ13_Pztrj2yaIwOcFGtdKzYs1HoNNFMb7R8Jl_SCj2g-jwjW5bQ"/>
</div>
<div class="aspect-square border-r border-on-surface cursor-pointer hover:opacity-80 transition-opacity bg-surface-container thumb-btn" data-src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6D6XoYsYiBhS9iVvTyQDvzr6RWgqPJ12Mobp1lDtsMEQX8eswjwpV5ID1iXdPUroWI5pli_lS0CZ8JWITVlcm-WLSXUiXy7hDbUTwFGMDWpMSbsMBp4A83dz8-REmeVUo7BRBtaU24sSoT5hdPsenDLumUIDL_sYu2hfKuMAOjtzOY0U7_sXqDqfACFlgdli4CBPrZ5F0Q3zzwt4ovUfU2pn6O8ZkRuLJASRX4f32eouEFTtC_U_pKQ">
<img class="w-full h-full object-cover" data-alt="Close up shot of the back of a black oversized streetwear hoodie featuring a large, abstract architectural graphic printed in crisp white ink. High contrast lighting in a minimalist gallery setting. Raw, brutalist vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6D6XoYsYiBhS9iVvTyQDvzr6RWgqPJ12Mobp1lDtsMEQX8eswjwpV5ID1iXdPUroWI5pli_lS0CZ8JWITVlcm-WLSXUiXy7hDbUTwFGMDWpMSbsMBp4A83dz8-REmeVUo7BRBtaU24sSoT5hdPsenDLumUIDL_sYu2hfKuMAOjtzOY0U7_sXqDqfACFlgdli4CBPrZ5F0Q3zzwt4ovUfU2pn6O8ZkRuLJASRX4f32eouEFTtC_U_pKQ"/>
</div>
<div class="aspect-square cursor-pointer hover:opacity-80 transition-opacity bg-surface-container thumb-btn" data-src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqGrJVo09iww319Jz0Xg7CGSSwLgm69TyFmEm0MeIDGD40HkiRPioQaYrmlPpG8KWv9G0vpj7rwoU9aGYo5PleHKlgxjZjcAhraf5nDYq95uMshC8giMM3VZ8JQL2CkQtGsxUSbNrJg9DZItZrBIuIu3IkeZhSnN2HvXbPJVVfnfabMQ-T3oNZdBySAnc8X5O_cCX3aSM8MRMKzTzag12TaHesr5u0FZqR5WrWXsDmjDWTmGCXv49txA">
<img class="w-full h-full object-cover" data-alt="Detail shot of the chunky metal zipper and thick drawstrings on a premium black streetwear hoodie. Stark white background, sharp focus, industrial and high-end streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqGrJVo09iww319Jz0Xg7CGSSwLgm69TyFmEm0MeIDGD40HkiRPioQaYrmlPpG8KWv9G0vpj7rwoU9aGYo5PleHKlgxjZjcAhraf5nDYq95uMshC8giMM3VZ8JQL2CkQtGsxUSbNrJg9DZItZrBIuIu3IkeZhSnN2HvXbPJVVfnfabMQ-T3oNZdBySAnc8X5O_cCX3aSM8MRMKzTzag12TaHesr5u0FZqR5WrWXsDmjDWTmGCXv49txA"/>
</div>
</div>
</div>
<!-- Product Info (Spans 5 cols on Desktop) -->
<div class="md:col-span-5 flex flex-col p-stack-md md:p-stack-lg justify-between animate-fade-in-up delay-100">
<div>
<div class="font-label-mono text-label-mono text-outline uppercase mb-2">LAST DANCE // HEAVYWEIGHT</div>
<h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase leading-none mb-stack-sm tracking-tight">
                        SIGNATURE<br/>HOODIE.01
                    </h1>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 mb-stack-md">
                        € 149,00
                    </div>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
                        The definitive silhouette. Engineered from 600GSM organic cotton. Oversized architectural fit with dropped shoulders and an exaggerated hood. Built for the modern urban environment.
                    </p>
<!-- Form / Selectors -->
<div class="mb-stack-lg animate-fade-in-up delay-200">
<div class="flex justify-between items-center mb-2">
<span class="font-label-mono text-label-mono uppercase">Size</span>
<a class="font-label-mono text-label-mono text-primary hover:underline" href="#">Size Guide</a>
</div>
<div class="flex gap-2 flex-wrap">
<button class="size-btn active w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface">S</button>
<button class="size-btn w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface">M</button>
<button class="size-btn w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface">L</button>
<button class="size-btn w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface">XL</button>
<button class="w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono text-outline line-through cursor-not-allowed">XXL</button>
</div>
</div>
</div>
<div class="flex flex-col gap-stack-sm animate-fade-in-up delay-300">
<button class="w-full bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2" id="add-to-bag-btn">
<span id="add-to-bag-text">Add to Bag</span>
<span class="material-symbols-outlined icon-fill text-[24px]" id="add-to-bag-icon">shopping_bag</span>
</button>
<button class="w-full border border-on-surface bg-transparent text-on-surface font-headline-md text-headline-md uppercase py-4 hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                        Mit <span class="font-bold text-primary">shop</span> kaufen
                    </button>
<div class="text-center mt-2">
<a class="font-label-mono text-label-mono underline text-outline hover:text-on-surface" href="#">Weitere Bezahlmöglichkeiten</a>
</div>
</div>
</div>
</div>
<!-- Style With Section -->
<section class="mt-stack-lg pt-stack-lg border-t border-on-surface">
<h2 class="font-headline-md text-headline-md uppercase mb-stack-md tracking-tight animate-fade-in-up delay-100">Complete the Look</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Recommended Product 1 -->
<div class="group border border-on-surface animate-fade-in-up delay-200">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Wide fit black cargo pants shown in a stark white studio environment. High contrast lighting highlighting the structured fabric and utilitarian pockets. Brutalist streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFbG5w_EMdbmpU3cECQWl2EPC265LIYvGuCa6hdFfDRAv4yhW4rOi2kgrtVHANoiqQlqebch-KWWfTwGqLiCFc8_xlFY57CP4Kp2X9C0H833FZGXOgEoJj4emdzIWjYCQLr2IgtCVHlix9KV3rATi7K6DfiYxxYSKM-BnYTwPJF6lJTh40cu11g8avnrSArRgg1VVzccJH7C89B3aY6JSldsHuOqhsPO8V6dXFAExYOdr-j1Kx2nT_XQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Utility Cargo</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Bottoms</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 120
                        </div>
</div>
</div>
<!-- Recommended Product 2 -->
<div class="group border border-on-surface animate-fade-in-up delay-300">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Chunky black minimalist sneakers shot from a low angle in a pristine white studio. High key lighting emphasizing the geometric, architectural sole design. High-end streetwear vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc8YvXzn5aC86GxLlzHHITBX5LzBOgqSHdrqcXR93c96Y296NUYAPBnD7LLEaK9OMDRpJ415LUEmKVMi8F3uKlfLtXQ3bF_dGEUADWkGjPVpjGvl9uMJYvgv8JGy086u7c6b0FP3XxBavTkNrwP4VNp68zwN4OOx2saYWYPkoKF-xAj2vGTkVwL2T-e9MfyuHwnGn70IUwWR6vQxChnnGC4US94kPHcjHl3FNaaETiRbC3FtTreaztiQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Block Runner</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Footwear</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 250
                        </div>
</div>
</div>
<!-- Recommended Product 3 -->
<div class="group border border-on-surface hidden md:block animate-fade-in-up delay-400">
<div class="aspect-square bg-surface-container relative overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A sleek, minimalist black crossbody bag with heavy metal hardware. Shot against a white backdrop with sharp, dramatic shadows. Technical streetwear accessory." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCViaENUEUKm1W_oB43vGLOEnwkjxuIygqbHvF7BtQfzZJQDBwCMvvFrd_dEZVsn4wLpNNVFyzlhlrdL-x4wNMZpM1CrvmX2wcWYOA31Uwv-TUJ1IHRVFcANddkpwkttiOO_toxBJF35hpamo17cc-4JJQorAu3S0-whTIR_VPFoia86InbgdZXQQWo88C0u2m9-DVGSpREqng9rFVUa3Z_ulACuR98c-6ThggMvZoL_TByNiwA87Y_GQ"/>
</div>
<div class="p-stack-sm border-t border-on-surface flex justify-between items-start">
<div>
<div class="font-headline-md text-[20px] uppercase leading-none">Tech Pouch</div>
<div class="font-label-mono text-label-mono text-outline mt-1">Accessories</div>
</div>
<div class="bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1">
                            € 65
                        </div>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-on-surface dark:bg-surface-container-lowest text-surface dark:text-on-surface font-label-mono text-label-mono uppercase w-full mt-stack-lg border-t border-on-surface flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-desktop py-stack-lg gap-gutter">
<div class="font-headline-md text-headline-md text-surface dark:text-on-surface mb-stack-md md:mb-0">
                LAST DANCE
            </div>
<nav class="flex flex-wrap gap-stack-md mb-stack-md md:mb-0">
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Newsletter</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Shipping</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Returns</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
</nav>
<div class="text-surface-variant dark:text-on-surface-variant">
                © 2024 LAST DANCE. ALL RIGHTS RESERVED.
            </div>
</div>
</footer>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Size Button Interactions
        const sizeBtns = document.querySelectorAll('.size-btn');
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Add to Bag Button Animation
        const addToBagBtn = document.getElementById('add-to-bag-btn');
        const addToBagText = document.getElementById('add-to-bag-text');
        const addToBagIcon = document.getElementById('add-to-bag-icon');
        
        addToBagBtn.addEventListener('click', () => {
            // Trigger animation
            addToBagBtn.classList.remove('animate-pop');
            void addToBagBtn.offsetWidth; // trigger reflow
            addToBagBtn.classList.add('animate-pop');
            
            // Temporary state change
            const originalText = addToBagText.textContent;
            const originalIcon = addToBagIcon.textContent;
            
            addToBagText.textContent = 'Added';
            addToBagIcon.textContent = 'check';
            addToBagBtn.classList.add('bg-primary', 'text-on-primary');
            addToBagBtn.classList.remove('bg-on-surface', 'text-surface');
            
            setTimeout(() => {
                addToBagText.textContent = originalText;
                addToBagIcon.textContent = originalIcon;
                addToBagBtn.classList.remove('bg-primary', 'text-on-primary');
                addToBagBtn.classList.add('bg-on-surface', 'text-surface');
            }, 2000);
        });

        // Fluid Image Gallery Transitions
        const mainImage = document.getElementById('main-image');
        const thumbBtns = document.querySelectorAll('.thumb-btn');
        
        thumbBtns.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const newSrc = thumb.getAttribute('data-src');
                if (mainImage.src !== newSrc) {
                    mainImage.classList.add('image-changing');
                    
                    setTimeout(() => {
                        mainImage.src = newSrc;
                        mainImage.classList.remove('image-changing');
                    }, 200); // Wait for fade out to complete before swapping source
                }
            });
        });
    });
</script>
</body></html>

<!-- LAST DANCE - Ana Sayfa -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>LAST DANCE | Official Store</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;600&amp;family=JetBrains+Mono:wght@500&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            font-feature-settings: 'liga';
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed": "#e2e2e2",
                        "on-error": "#ffffff",
                        "primary-fixed-dim": "#bcc2ff",
                        "error": "#ba1a1a",
                        "surface-container": "#efeded",
                        "on-tertiary-container": "#c7c8c8",
                        "tertiary-fixed-dim": "#c6c6c7",
                        "primary-fixed": "#dfe0ff",
                        "on-primary-container": "#bfc4ff",
                        "surface-tint": "#273fff",
                        "secondary-container": "#e2e2e2",
                        "secondary-fixed": "#e2e2e2",
                        "surface-bright": "#faf9f9",
                        "on-secondary": "#ffffff",
                        "on-tertiary-fixed-variant": "#454747",
                        "surface": "#faf9f9",
                        "on-surface": "#1b1c1c",
                        "surface-variant": "#e3e2e2",
                        "on-secondary-fixed": "#1b1b1b",
                        "inverse-primary": "#bcc2ff",
                        "inverse-surface": "#303031",
                        "surface-container-highest": "#e3e2e2",
                        "on-secondary-container": "#646464",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f5f3f3",
                        "outline": "#757689",
                        "background": "#faf9f9",
                        "surface-container-high": "#e9e8e8",
                        "on-primary-fixed": "#000a64",
                        "secondary-fixed-dim": "#c6c6c6",
                        "inverse-on-surface": "#f2f0f0",
                        "primary-container": "#0029ff",
                        "error-container": "#ffdad6",
                        "on-tertiary-fixed": "#1a1c1c",
                        "on-error-container": "#93000a",
                        "tertiary": "#3b3d3d",
                        "on-surface-variant": "#444557",
                        "on-background": "#1b1c1c",
                        "on-secondary-fixed-variant": "#474747",
                        "on-primary-fixed-variant": "#0022db",
                        "surface-dim": "#dbdad9",
                        "on-primary": "#ffffff",
                        "primary": "#001cbf",
                        "on-tertiary": "#ffffff",
                        "outline-variant": "#c5c5da",
                        "secondary": "#5e5e5e",
                        "tertiary-container": "#525454"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "stack-sm": "8px",
                        "stack-md": "24px",
                        "stack-lg": "48px",
                        "margin-mobile": "20px",
                        "container-max": "1440px",
                        "margin-desktop": "64px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "label-mono": [
                            "JetBrains Mono"
                        ],
                        "body-lg": [
                            "Geist"
                        ],
                        "headline-lg-mobile": [
                            "Anton"
                        ],
                        "headline-lg": [
                            "Anton"
                        ],
                        "display-lg": [
                            "Anton"
                        ],
                        "body-md": [
                            "Geist"
                        ],
                        "headline-md": [
                            "Anton"
                        ]
                    },
                    "fontSize": {
                        "label-mono": [
                            "12px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "0.1em",
                                "fontWeight": "500"
                            }
                        ],
                        "body-lg": [
                            "18px",
                            {
                                "lineHeight": "160%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg-mobile": [
                            "32px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg": [
                            "48px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "display-lg": [
                            "96px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "400"
                            }
                        ],
                        "body-md": [
                            "16px",
                            {
                                "lineHeight": "150%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-md": [
                            "24px",
                            {
                                "lineHeight": "120%",
                                "fontWeight": "400"
                            }
                        ]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-surface text-on-surface font-body-md antialiased selection:bg-primary selection:text-on-primary">
<!-- TopNavBar -->
<nav class="bg-surface dark:bg-surface w-full top-0 sticky z-50 border-b border-on-surface dark:border-outline flat no shadows">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
<!-- Brand Logo -->
<a class="font-headline-md text-headline-md uppercase text-on-surface dark:text-inverse-on-surface tracking-tighter scale-95 transition-transform duration-150 flex items-center gap-2" href="#">
<img alt="LAST DANCE Logo" class="h-10 w-10 object-contain rounded-DEFAULT" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA"/>
                LAST DANCE
            </a>
<!-- Navigation Links (Web) -->
<div class="hidden md:flex items-center gap-stack-md font-headline-md text-headline-md uppercase">
<a class="text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1 scale-95 transition-transform duration-150" href="#">New Arrivals</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150" href="#">Collections</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150" href="#">Accessories</a>
<a class="text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150" href="#">Archive</a>
</div>
<!-- Trailing Icons -->
<div class="flex items-center gap-stack-sm text-primary dark:text-primary-fixed-dim">
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150 p-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">search</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150 p-2 hidden md:block">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">person</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed-dim transition-all scale-95 transition-transform duration-150 p-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shopping_bag</span>
</button>
</div>
</div>
</nav>
<!-- Main Canvas -->
<main class="w-full max-w-container-max mx-auto">
<!-- Hero Section -->
<section class="w-full border-b border-on-surface mb-stack-lg">
<div class="grid grid-cols-1 md:grid-cols-12 min-h-[70vh]">
<!-- Hero Text -->
<div class="col-span-1 md:col-span-5 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-stack-lg md:py-0 border-b md:border-b-0 md:border-r border-on-surface">
<h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase mb-stack-sm text-on-surface">
                        The<br/>Final<br/>Drop.
                    </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-md max-w-md">
                        Unapologetic streetwear. Brutalist design. This is your last chance to secure the archive.
                    </p>
<div class="flex gap-4">
<a class="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary transition-colors duration-200" href="#">
                            Shop Now
                        </a>
</div>
</div>
<!-- Hero Image -->
<div class="col-span-1 md:col-span-7 bg-surface-container relative overflow-hidden group min-h-[50vh] md:min-h-full" data-alt="A highly stylized editorial shot of a model wearing a heavy black streetwear hoodie in a stark, brutalist concrete environment. High contrast lighting with harsh shadows. The mood is edgy, urban, and uncompromising, fitting a premium streetwear brand aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzMh6fRDfkSM3SNPiL7576E0rv7YSo_zMVFQMFZs9t5_Nk63qNYz_KlomIWfL-_2IkmpIqnBcDYxxZpRcu0piF3HuW4xPdzeD8SR15ehP4HjEflckOZSbSDku1Rk5sJ8_vs8wzddf3DezYdfAywmYW1wdRwdWqaomM-Dsf1cx6K0OGj527Nzw6FJuiRxK1VT_Z_th-R5oS4tq5rR8mKIBSTsQGwIh6oRKUT7ASzCWaMQ5DLEMl25lKsA'); background-size: cover; background-position: center;">
<div class="absolute bottom-stack-md right-stack-md bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
                        Campaign 001
                    </div>
</div>
</div>
</section>
<!-- New Arrivals Grid -->
<section class="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg">
<div class="flex justify-between items-end mb-stack-md border-b border-on-surface pb-stack-sm">
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">New Arrivals</h2>
<a class="font-label-mono text-label-mono uppercase text-on-surface hover:text-primary transition-colors" href="#">View All</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-on-surface">
<!-- Product 1 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-colors duration-300">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="A stark product shot of a premium, heavy-weight black hoodie featuring a bold, minimalist white geometric graphic on the chest. The hoodie is laid flat against a pure white background with harsh, direct lighting creating crisp shadows. High-end streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3dP2AQM_V5Z8VRogQhzfJnqbg_ID1F0CtA-Ww1OMOKzrpguIGavduJfIbhJqPbTu3W5oAIXHBkm71oYYdbbU63Q-zppWE-55ZDNtL2Au_6a3xCUWoF6ErqfjxKF3O1b7-RNBzeqpkgkAnLsUbKUKYo7zPYUZfA3AR17yj4URFWX25iEEMvwU-rHiTvbduBM1M0ky1j_IoPOaNuKVtfyP9uE1ZYfyvY96LzexWkNsnhdRs0Z_9MJ96uw"/>
<div class="absolute top-4 left-4 bg-primary text-on-primary font-label-mono text-label-mono px-2 py-1">NEW</div>
</div>
<div class="p-4 flex flex-col gap-2">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Core Black Hoodie</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€89,00</div>
</div>
</div>
<!-- Product 2 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-colors duration-300">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="A stark product shot of a premium, heavy-weight crimson red hoodie featuring a bold, minimalist white geometric graphic on the chest. The hoodie is laid flat against a pure white background with harsh, direct lighting creating crisp shadows. High-end streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOUJh1fyy5UJKM6Fqf-hjv96law3DjMRpvXL5Es8Q5sMRXdxdlEaK-rWVMEmeWAywi6SVbamZohAnBuR1PKDZyr7TAmTdrS7k6uzOpO_goLXoiGdrifCjmOnM5AwPa_O1Kz59W-KkXlpyMu4L5eUPXVhv641RzcENwLrDLspNiDLG9zqLY75gvfEEfYA3NjIbChNajDhW0Hm1HLlmP0xJX8V7CkeAa1vM81AHAsHNx7Ehtp_xxGbrBtA"/>
</div>
<div class="p-4 flex flex-col gap-2">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Core Red Hoodie</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€89,00</div>
</div>
</div>
<!-- Product 3 -->
<div class="group border-r border-b border-on-surface flex flex-col bg-surface hover:bg-surface-container transition-colors duration-300">
<div class="w-full aspect-[4/5] relative overflow-hidden bg-surface-bright">
<img class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="A stark product shot of a premium, heavy-weight crisp white hoodie featuring a bold, grey arched text graphic on the chest. The hoodie is laid flat against a subtle off-white background with harsh, direct lighting creating crisp shadows. High-end streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz7TfBzjZHRirMOVmD1f-CYdaRy2mK5kCjW_nQeo38S6DEqVZgQ-N1uoo5CUmPzsVWrm9hBIR4A9r1Cf5L6XDgDaFr1tWvL9FaJ9MeTB9PgAS0QQkNMoikaBP14QgLNSGDzUunliGYY52fGW11GhNn8JRQqAgja98O3pg-KUWQqZ5dFGZiOmcag1Z7cCjUKXmtJSfcQ221ffZwquMd7sN6DXh3yssZgfpe0R2thjmr8FM4SYzALVlmgw"/>
<div class="absolute top-4 left-4 bg-tertiary text-on-tertiary font-label-mono text-label-mono px-2 py-1">LIMITED</div>
</div>
<div class="p-4 flex flex-col gap-2">
<h3 class="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">Arch Logo White</h3>
<div class="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">€95,00</div>
</div>
</div>
</div>
</section>
<!-- Bento Grid Collections -->
<section class="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg">
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface mb-stack-md border-b border-on-surface pb-stack-sm">Collections</h2>
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter grid-rows-[auto]">
<!-- Large Feature -->
<a class="col-span-1 md:col-span-8 group relative block overflow-hidden border border-on-surface min-h-[400px] md:min-h-[600px]" href="#">
<div class="absolute inset-0 bg-surface-container transition-transform duration-700 group-hover:scale-105" data-alt="A wide architectural shot of an abandoned industrial warehouse interior. Soft, natural light streams in through broken skylights, illuminating dust motes. In the center, a solitary figure wearing a voluminous black jacket stands motionless. Brutalist, melancholic streetwear vibe." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAMIp_yrl2i-ZHVyakQtSbRFeoOiDQ0j9t_rBf3WNsNKJRLkgvlvj1FJIlZ7ngVxB6u2OGBwaRf0ibRmh69U9aqqqaqnCa6IDLJumLKB7iOpQ1cMQvirZdpyNd5b2-H9Ckdf5VnJu36jq6Sgk1ocE5opopnS9e_HtUJ0jMEIgNHqp20S43JBcg8nDDIoxFO6X2iwK850ijwY21x2DT3FGU_LH-tgVxq2gdblsbd-BLaPZ8E-3UEdm18g'); background-size: cover; background-position: center;"></div>
<div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
<div class="absolute bottom-0 left-0 p-stack-md w-full flex justify-between items-end">
<h3 class="font-headline-md text-headline-lg-mobile md:text-headline-lg uppercase text-surface leading-none">The<br/>Industrial<br/>Complex</h3>
<div class="bg-surface text-on-surface font-label-mono text-label-mono px-4 py-2 uppercase border border-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">Explore</div>
</div>
</a>
<!-- Side Stack -->
<div class="col-span-1 md:col-span-4 flex flex-col gap-gutter">
<!-- Top Side -->
<a class="group relative block overflow-hidden border border-on-surface flex-1 min-h-[250px]" href="#">
<div class="absolute inset-0 bg-surface-container transition-transform duration-700 group-hover:scale-105" data-alt="A tight, detailed macro shot of heavy black denim fabric. Focus is on thick, rugged silver hardware, a chunky zipper, and contrasting white stitching. The texture is rough and premium. Urban utilitarian aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuASnUWsYNAroqTBuH6A_t1IQGwwV9H4r14hGP2L49UBGcte9_rXbmGG564jczunWWH7_vMW5LLh6mLV3pQXDyCMTEKVcbOsXU2SfcYhVfBV_LEI6d4C1Imonk-UpKfz_--XKS7D_xYmeekHrUuaaZ0obCejOrKTyUgiJEjaCSU1gYGlTLenYFiusIi26HMLExJObqQ_Ws0K96NiWOis9T-uiaQLtDRyqBsYHn84fsqP_gRokLd-kzMyrg'); background-size: cover; background-position: center;"></div>
<div class="absolute top-0 left-0 p-4 bg-surface text-on-surface border-r border-b border-on-surface font-label-mono text-label-mono uppercase">Heavyweight</div>
</a>
<!-- Bottom Side -->
<div class="bg-on-surface text-surface flex-1 p-stack-md flex flex-col justify-center border border-on-surface min-h-[250px]">
<h4 class="font-headline-md text-headline-md uppercase mb-4">Join the Syndicate</h4>
<p class="font-label-mono text-label-mono text-surface-variant mb-6">Exclusive access to limited drops before they hit the main grid.</p>
<form class="flex w-full border-b border-surface pb-2 group focus-within:border-primary transition-colors">
<input class="bg-transparent w-full font-label-mono text-label-mono text-surface placeholder:text-surface-variant focus:outline-none focus:ring-0 border-none p-0" placeholder="EMAIL ADDRESS" type="email"/>
<button class="text-surface group-focus-within:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</form>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-on-surface dark:bg-surface-container-lowest w-full mt-stack-lg border-t border-on-surface flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
<!-- Brand -->
<div class="flex flex-col gap-stack-sm w-full md:w-auto">
<span class="font-headline-md text-headline-md text-surface dark:text-on-surface uppercase tracking-tighter">LAST DANCE</span>
<span class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant">© 2024 LAST DANCE. ALL RIGHTS RESERVED.</span>
</div>
<!-- Links -->
<div class="flex flex-wrap md:flex-nowrap gap-stack-md font-label-mono text-label-mono uppercase w-full md:w-auto mt-stack-md md:mt-0">
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Newsletter</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Shipping</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Returns</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a>
<a class="text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="#">Contact</a>
</div>
</div>
</footer>
</body></html>

<!-- LAST DANCE - Koleksiyonlar -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>LAST DANCE - Collections</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;600&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary-fixed": "#e2e2e2",
                        "on-error": "#ffffff",
                        "primary-fixed-dim": "#bcc2ff",
                        "error": "#ba1a1a",
                        "surface-container": "#efeded",
                        "on-tertiary-container": "#c7c8c8",
                        "tertiary-fixed-dim": "#c6c6c7",
                        "primary-fixed": "#dfe0ff",
                        "on-primary-container": "#bfc4ff",
                        "surface-tint": "#273fff",
                        "secondary-container": "#e2e2e2",
                        "secondary-fixed": "#e2e2e2",
                        "surface-bright": "#faf9f9",
                        "on-secondary": "#ffffff",
                        "on-tertiary-fixed-variant": "#454747",
                        "surface": "#faf9f9",
                        "on-surface": "#1b1c1c",
                        "surface-variant": "#e3e2e2",
                        "on-secondary-fixed": "#1b1b1b",
                        "inverse-primary": "#bcc2ff",
                        "inverse-surface": "#303031",
                        "surface-container-highest": "#e3e2e2",
                        "on-secondary-container": "#646464",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f5f3f3",
                        "outline": "#757689",
                        "background": "#faf9f9",
                        "surface-container-high": "#e9e8e8",
                        "on-primary-fixed": "#000a64",
                        "secondary-fixed-dim": "#c6c6c6",
                        "inverse-on-surface": "#f2f0f0",
                        "primary-container": "#0029ff",
                        "error-container": "#ffdad6",
                        "on-tertiary-fixed": "#1a1c1c",
                        "on-error-container": "#93000a",
                        "tertiary": "#3b3d3d",
                        "on-surface-variant": "#444557",
                        "on-background": "#1b1c1c",
                        "on-secondary-fixed-variant": "#474747",
                        "on-primary-fixed-variant": "#0022db",
                        "surface-dim": "#dbdad9",
                        "on-primary": "#ffffff",
                        "primary": "#001cbf",
                        "on-tertiary": "#ffffff",
                        "outline-variant": "#c5c5da",
                        "secondary": "#5e5e5e",
                        "tertiary-container": "#525454"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "stack-sm": "8px",
                        "stack-md": "24px",
                        "stack-lg": "48px",
                        "margin-mobile": "20px",
                        "container-max": "1440px",
                        "margin-desktop": "64px",
                        "gutter": "24px"
                    },
                    "fontFamily": {
                        "label-mono": [
                            "JetBrains Mono"
                        ],
                        "body-lg": [
                            "Geist"
                        ],
                        "headline-lg-mobile": [
                            "Anton"
                        ],
                        "headline-lg": [
                            "Anton"
                        ],
                        "display-lg": [
                            "Anton"
                        ],
                        "body-md": [
                            "Geist"
                        ],
                        "headline-md": [
                            "Anton"
                        ]
                    },
                    "fontSize": {
                        "label-mono": [
                            "12px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "0.1em",
                                "fontWeight": "500"
                            }
                        ],
                        "body-lg": [
                            "18px",
                            {
                                "lineHeight": "160%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg-mobile": [
                            "32px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-lg": [
                            "48px",
                            {
                                "lineHeight": "110%",
                                "fontWeight": "400"
                            }
                        ],
                        "display-lg": [
                            "96px",
                            {
                                "lineHeight": "100%",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "400"
                            }
                        ],
                        "body-md": [
                            "16px",
                            {
                                "lineHeight": "150%",
                                "fontWeight": "400"
                            }
                        ],
                        "headline-md": [
                            "24px",
                            {
                                "lineHeight": "120%",
                                "fontWeight": "400"
                            }
                        ]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: theme('colors.surface');
            color: theme('colors.on-surface');
        }
        
        /* Brutalist 1px Borders */
        .brutalist-border {
            border: 1px solid theme('colors.on-surface');
        }
        .brutalist-border-bottom {
            border-bottom: 1px solid theme('colors.on-surface');
        }
        
        /* Button Hover Inversion */
        .btn-primary:hover {
            background-color: theme('colors.primary-container');
            color: theme('colors.on-primary-container');
        }
        
        /* Grid Layouts */
        .product-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: theme('spacing.gutter');
        }
        
        .product-item {
            grid-column: span 12;
        }
        @media (min-width: 768px) {
            .product-item {
                grid-column: span 6;
            }
        }
        @media (min-width: 1024px) {
            .product-item {
                grid-column: span 4;
            }
        }
    </style>
</head>
<body class="font-body-md bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar (Shared Component) -->
<header class="w-full top-0 sticky z-50 bg-surface dark:bg-surface border-b border-on-surface dark:border-outline">
<div class="flex justify-between items-center w-full px-margin-desktop py-stack-sm max-w-container-max mx-auto">
<!-- Brand Logo -->
<a class="flex items-center gap-2" href="/">
<img alt="LAST DANCE Logo" class="h-10 w-10 object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA"/>
<span class="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface tracking-tighter uppercase">LAST DANCE</span>
</a>
<!-- Desktop Navigation -->
<nav class="hidden md:flex items-center gap-6">
<a class="font-headline-md text-headline-md uppercase text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors" href="/new-arrivals">New Arrivals</a>
<a class="font-headline-md text-headline-md uppercase text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1" href="/collections">Collections</a>
<a class="font-headline-md text-headline-md uppercase text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors" href="/accessories">Accessories</a>
<a class="font-headline-md text-headline-md uppercase text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors" href="/archive">Archive</a>
</nav>
<!-- Trailing Actions -->
<div class="flex items-center gap-4">
<button aria-label="Search" class="text-on-surface hover:text-primary transition-colors scale-95 transition-transform duration-150">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">search</span>
</button>
<button aria-label="Profile" class="text-on-surface hover:text-primary transition-colors scale-95 transition-transform duration-150 hidden md:block">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">person</span>
</button>
<button aria-label="Cart" class="text-on-surface hover:text-primary transition-colors scale-95 transition-transform duration-150">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shopping_bag</span>
</button>
</div>
</div>
</header>
<!-- Main Content Area: Sidebar + Grid -->
<main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
<!-- Sidebar Filters -->
<aside class="w-full md:w-64 flex-shrink-0 flex flex-col gap-stack-md hidden md:flex">
<h2 class="font-headline-md text-headline-md uppercase brutalist-border-bottom pb-stack-sm mb-4">Filters</h2>
<!-- Category Filter -->
<div>
<h3 class="font-label-mono text-label-mono uppercase mb-3">Category</h3>
<ul class="flex flex-col gap-2">
<li><label class="flex items-center gap-2 cursor-pointer font-body-md text-body-md"><input class="form-checkbox h-4 w-4 text-primary border-on-surface bg-transparent focus:ring-primary focus:ring-2 rounded-none" type="checkbox"/> Hoodies</label></li>
<li><label class="flex items-center gap-2 cursor-pointer font-body-md text-body-md"><input class="form-checkbox h-4 w-4 text-primary border-on-surface bg-transparent focus:ring-primary focus:ring-2 rounded-none" type="checkbox"/> Tees</label></li>
<li><label class="flex items-center gap-2 cursor-pointer font-body-md text-body-md"><input class="form-checkbox h-4 w-4 text-primary border-on-surface bg-transparent focus:ring-primary focus:ring-2 rounded-none" type="checkbox"/> Outerwear</label></li>
</ul>
</div>
<!-- Size Filter -->
<div>
<h3 class="font-label-mono text-label-mono uppercase mb-3">Size</h3>
<div class="flex flex-wrap gap-2">
<button class="brutalist-border px-3 py-1 font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">S</button>
<button class="brutalist-border px-3 py-1 font-label-mono text-label-mono bg-on-surface text-surface">M</button>
<button class="brutalist-border px-3 py-1 font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">L</button>
<button class="brutalist-border px-3 py-1 font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors">XL</button>
</div>
</div>
<!-- Price Filter -->
<div>
<h3 class="font-label-mono text-label-mono uppercase mb-3">Price</h3>
<div class="flex items-center gap-2">
<input class="w-full bg-transparent brutalist-border px-2 py-1 font-label-mono text-label-mono focus:outline-none focus:border-primary-container focus:border-2 placeholder:text-on-surface-variant" placeholder="Min" type="number"/>
<span class="font-label-mono">-</span>
<input class="w-full bg-transparent brutalist-border px-2 py-1 font-label-mono text-label-mono focus:outline-none focus:border-primary-container focus:border-2 placeholder:text-on-surface-variant" placeholder="Max" type="number"/>
</div>
</div>
</aside>
<!-- Product Grid Area -->
<section class="flex-1 w-full">
<!-- Mobile Filter Toggle -->
<div class="md:hidden mb-stack-md flex justify-between items-center brutalist-border-bottom pb-stack-sm">
<h1 class="font-headline-md text-headline-md uppercase">Collections</h1>
<button class="flex items-center gap-1 font-label-mono text-label-mono uppercase border border-on-surface px-3 py-1">
                    Filters <span class="material-symbols-outlined text-sm">tune</span>
</button>
</div>
<!-- The Grid -->
<div class="product-grid">
<!-- Product Card 1 (Black Hoodie) -->
<article class="product-item flex flex-col group relative">
<div class="w-full aspect-[4/5] bg-surface-container flex items-center justify-center overflow-hidden brutalist-border mb-3 relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A studio shot of a heavy black streetwear hoodie with a bold white geometric 'STAY HIGH' triangle logo printed on the chest. The hoodie is laid flat against a stark white, minimalist background with high contrast lighting emphasizing the fabric texture and raw aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnqQul72DRXcXXF6nQEqLmirQnDsyJu-Q4DGvDlFCEpInCYtu_apLMbdxqmgsJnJR6Cc6z2X6APnWl0lPU8-p-91r5JltQT2Ke7LWP4KJLmMhxbqIel4oCZ2RpAENvL7NhW8rLcVH-jx2Scpe9x7H-RtgRCwzGuezK20ialZwZt6X4tUx_-D8-3JYqh7f3W9jY3CGp7_g-qaglc7m9gfpciMA1E8TNXbRzHXgnrWfQ9j8sdxrZwGSsSw"/>
<!-- Quick Add Overlay -->
<button class="absolute bottom-4 left-4 right-4 bg-on-surface text-surface font-headline-md text-headline-md uppercase py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-primary">Quick Add</button>
<!-- Limited Tag -->
<span class="absolute top-4 left-4 bg-primary-container text-on-primary-container px-2 py-1 font-label-mono text-label-mono uppercase">Limited</span>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-label-mono text-label-mono uppercase truncate">STAY HIGH LOGO HOODIE BLACK</h3>
<div class="bg-on-surface text-surface w-fit px-2 py-1">
<span class="font-label-mono text-label-mono">€29,41</span>
</div>
</div>
</article>
<!-- Product Card 2 (Red Hoodie) -->
<article class="product-item flex flex-col group relative">
<div class="w-full aspect-[4/5] bg-surface-container flex items-center justify-center overflow-hidden brutalist-border mb-3 relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A studio shot of a vibrant red streetwear hoodie with a bold white geometric 'STAY HIGH' triangle logo printed on the chest. The hoodie is laid flat against a stark white, minimalist background with high contrast lighting, emphasizing the raw, urgent Last Dance aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5BeqhR-1OaVW29qwRTNsJU1D22PrgyJ7w_7L4V1__22btch5bqML2CHurMJdLUCq35rlMlBUI5P9eHeVlSQwK8111fm-cGRzUEdgkqNY1iqr8svBKX0d3_EWIBEyxIl0J6dmKQLUwgT0ch3Vo7iRNbJl5t7RWWTuNIYeQfpDHXXNdfn-zspFm_b5K2zKGwxBi_GxhGRmBhJG3oGeShFMTqzHa40hdLDcq5CcKSZ_86dTMgotpvrXh5w"/>
<!-- Quick Add Overlay -->
<button class="absolute bottom-4 left-4 right-4 bg-on-surface text-surface font-headline-md text-headline-md uppercase py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-primary">Quick Add</button>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-label-mono text-label-mono uppercase truncate">STAY HIGH LOGO HOODIE RED</h3>
<div class="bg-on-surface text-surface w-fit px-2 py-1">
<span class="font-label-mono text-label-mono">€29,41</span>
</div>
</div>
</article>
<!-- Product Card 3 (White Hoodie) -->
<article class="product-item flex flex-col group relative">
<div class="w-full aspect-[4/5] bg-surface-container flex items-center justify-center overflow-hidden brutalist-border mb-3 relative">
<!-- Using background image style for the lifestyle shot -->
<div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" data-alt="A lifestyle editorial shot of a stark white streetwear hoodie with 'SHBZT' curved arch text logo across the chest. The hoodie is worn or suspended against a dramatic, brutalist backdrop of rugged, rocky mountain terrain under an overcast, moody sky. High fashion streetwear aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6AjgT3EhW5_CUpq59xdt9iCWhoyMzK1qF4XPR_QhhnbBwYnXvL4GKldhz9c_yfGjRex2I_eZPHcdH4He1K_N4iAvv8EdL7Aos8apV_z5fDUk_MWdEoDJu53HKU8rdGlvqZlq3dOWnQ4a3KJhTo5nKGu_wzE5P0sInyMhcySQHuD7-zLw6p9ELMWb3ZAIPY6y7ZwDCGqqAUmpJKAaw8-Iqiv60maKql_-fu-VHjyjehWvAXfuxJuSwMA')"></div>
<!-- Quick Add Overlay -->
<button class="absolute bottom-4 left-4 right-4 bg-on-surface text-surface font-headline-md text-headline-md uppercase py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-primary">Quick Add</button>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-label-mono text-label-mono uppercase truncate">STAY HIGH SHBZT HOODIE</h3>
<div class="bg-on-surface text-surface w-fit px-2 py-1">
<span class="font-label-mono text-label-mono">€50,34</span>
</div>
</div>
</article>
<!-- Product Card 4 (Placeholder Tee) -->
<article class="product-item flex flex-col group relative">
<div class="w-full aspect-[4/5] bg-surface-container flex items-center justify-center overflow-hidden brutalist-border mb-3 relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A minimalist flat lay of a heavy cotton oversized t-shirt in deep black, featuring a subtle, tonal embroidered Last Dance logo on the hem. The background is a stark concrete texture, lit with sharp, architectural lighting to cast distinct shadows. Brutalist streetwear aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtmGJLpzVXZqTQw4BEGku7cSKSHEu-3leVq7ScOZzNVIqOZY4YlHuBYD4TltKnh8ON6uuGREQ1pjjWhOYe4_e56kmt-o9BEybDpHKUYlSiSe_WrbHY_zpehOwktqcuBlN51fSNcX4yM57_u_ZEGVduFtm_wu1avb1mIYEqAYbd9fMtsw5ndSPn4fg8PBQEvas48d5U5iK6RUqiqsRuIXVXSHVv8njZYhRYfQRZ1mO-j7NWXKFhSb7OWg"/>
<button class="absolute bottom-4 left-4 right-4 bg-on-surface text-surface font-headline-md text-headline-md uppercase py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-primary">Quick Add</button>
<span class="absolute top-4 left-4 bg-secondary text-on-secondary px-2 py-1 font-label-mono text-label-mono uppercase">Sold Out</span>
</div>
<div class="flex flex-col gap-1">
<h3 class="font-label-mono text-label-mono uppercase truncate text-on-surface-variant">HEAVYWEIGHT TEE BLACK</h3>
<div class="bg-on-surface text-surface w-fit px-2 py-1 opacity-50">
<span class="font-label-mono text-label-mono line-through">€35,00</span>
</div>
</div>
</article>
</div>
<!-- Pagination / Load More -->
<div class="mt-stack-lg flex justify-center border-t border-on-surface pt-stack-md">
<button class="font-headline-md text-headline-md uppercase bg-transparent text-on-surface brutalist-border px-8 py-3 hover:bg-on-surface hover:text-surface transition-colors">Load More</button>
</div>
</section>
</main>
<!-- Footer (Shared Component) -->
<footer class="w-full mt-stack-lg bg-on-surface dark:bg-surface-container-lowest border-t border-on-surface flat no shadows">
<div class="flex flex-col md:flex-row justify-between items-start w-full px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
<!-- Brand / Copyright -->
<div class="flex flex-col gap-4">
<a class="flex items-center gap-2" href="/">
<span class="font-headline-md text-headline-md text-surface dark:text-on-surface uppercase">LAST DANCE</span>
</a>
<p class="font-label-mono text-label-mono text-surface-variant dark:text-on-surface-variant uppercase">© 2024 LAST DANCE. ALL RIGHTS RESERVED.</p>
</div>
<!-- Footer Links -->
<nav class="flex flex-wrap gap-x-8 gap-y-4">
<a class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="/newsletter">Newsletter</a>
<a class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="/shipping">Shipping</a>
<a class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="/returns">Returns</a>
<a class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="/terms">Terms</a>
<a class="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant hover:text-surface hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100 transition-opacity" href="/contact">Contact</a>
</nav>
</div>
</footer>
</body></html>