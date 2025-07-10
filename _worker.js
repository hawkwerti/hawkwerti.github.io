// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
		en: 'Detail Product',
		ko: '제품 상세보기',
		ja: '商品詳細',
		de: 'Produktdetails',
		pl: 'Szczegóły produktu',
		th: 'ดูรายละเอียดสินค้า',
		es: 'Detalles del producto',
		pt: 'Detalhes do produto',
		ar: 'تفاصيل المنتج',
		it: 'Dettagli del prodotto',
		fr: 'Détails du produit'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrls[0]}">
<meta property="og:url" content="${url.href}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="go.gibsob.com">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb">
<a href="/">🏠 HOME</a>
</div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
if (!isBot && !navigator.webdriver) {
setTimeout(() => {
location.href = "${affUrl}";
}, 3000);
}
})();
</script>

<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
let lang = "${lang}";
const redirectUrlHuman = "${affUrl}";
if (lang === "en") lang = "www";
const redirectUrlBot = "https://" + lang + ".aliexpress.com/item/${data.productId}.html";
if (isBot) {
setTimeout(() => {
location.href = redirectUrlBot;
}, 3000);
} else {
setTimeout(() => {
location.href = redirectUrlHuman;
}, 3000);
}
})();
</script>

</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;

		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		if (!self.verificationLists) {
			self.verificationLists = [];

			const sources = [
				{ url: "https://go.gibsob.com/verif.txt", base: "https://athineama.github.io/HTML/" },
				{ url: "https://go.gibsob.com/test.txt", base: "https://ambeyen.github.io/HTML/" },
				{ url: "https://go.gibsob.com/xyz.txt", base: "https://namalain.github.io/HTML/" },
			];

			// Ambil semua daftar verifikasi sekaligus
			self.verificationLists = await Promise.all(
				sources.map(async ({ url, base }) => {
					const res = await fetch(url);
					const text = await res.text();
					const paths = new Set(
						text.split("\n").map(line => line.trim()).filter(Boolean)
					);
					return { base, paths };
				})
			);
		}

		// Cek apakah `cleanPath` ada di salah satu verification list
		for (const { base, paths } of self.verificationLists) {
			if (paths.has(cleanPath)) {
				const fileRes = await fetch(`${base}${cleanPath}`);

				if (!fileRes.ok) {
					return new Response("Failed to load verification file", { status: 502 });
				}

				const html = await fileRes.text();

				return new Response(html, {
					status: 200,
					headers: {
						"Content-Type": "text/html; charset=UTF-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			}
		}

		if (pathname === "/google613292532e0cfce0.html") {
			const fileRes = await fetch("https://nde.buytostore.com/google613292532e0cfce0.html");

			if (!fileRes.ok) {
				return new Response("Failed to load verification file", { status: 502 });
			}

			const html = await fileRes.text();

			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=UTF-8",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>go.gibsob.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>go.gibsob.com</h1>
    <div class="container">
        <a rel="dofollow" href="data/vv8iav52yi.txt" class="btn">DSwEda7e</a><a rel="dofollow" href="data/2gwf2xg9yx.txt" class="btn">9QlCbgYY</a><a rel="dofollow" href="data/54tkv1gdrr.txt" class="btn">rNYXcRTs</a><a rel="dofollow" href="data/w518cellvo.txt" class="btn">n8ygCPZl</a><a rel="dofollow" href="data/u33vmg0pfv.txt" class="btn">1326vt1u</a><a rel="dofollow" href="data/fpu7k3ri0j.txt" class="btn">SfdF21qR</a><a rel="dofollow" href="data/y7rzc5x2dw.txt" class="btn">yiUlefut</a><a rel="dofollow" href="data/vi2izs4vwk.txt" class="btn">n6e7WHed</a><a rel="dofollow" href="data/lrpy7mtezr.txt" class="btn">PSU6n13a</a><a rel="dofollow" href="data/w19wzyuf50.txt" class="btn">d8l3ljZZ</a><a rel="dofollow" href="data/8d7q5modlv.txt" class="btn">4LZnWnrP</a><a rel="dofollow" href="data/lyhbvqxerb.txt" class="btn">yHAGvD6N</a><a rel="dofollow" href="data/2ex1ytk28h.txt" class="btn">csWhDj3M</a><a rel="dofollow" href="data/7mpvxq8dih.txt" class="btn">g01fQJ0D</a><a rel="dofollow" href="data/xgau1jcn6n.txt" class="btn">Voe4MaYI</a><a rel="dofollow" href="data/almntjiish.txt" class="btn">WLsWSofE</a><a rel="dofollow" href="data/ect7c9mqom.txt" class="btn">9r2KpZvx</a><a rel="dofollow" href="data/ug2qnc3h0o.txt" class="btn">JfZjECRN</a><a rel="dofollow" href="data/l3gywme5st.txt" class="btn">C2oGSVSr</a><a rel="dofollow" href="data/hlsoxwrz7m.txt" class="btn">ZKLhZx3h</a><a rel="dofollow" href="data/kd1sdlwiq1.txt" class="btn">dABX7GNg</a><a rel="dofollow" href="data/gz1zwlvjh4.txt" class="btn">kuciKzhu</a><a rel="dofollow" href="data/wrszw0517t.txt" class="btn">62wyMof4</a><a rel="dofollow" href="data/ufmojqqcod.txt" class="btn">tTiLKowo</a><a rel="dofollow" href="data/bodv58l7s7.txt" class="btn">YFsf93VT</a><a rel="dofollow" href="data/xid4ib750r.txt" class="btn">wB6tdhYo</a><a rel="dofollow" href="data/lv8fsplw89.txt" class="btn">62aO5jDo</a><a rel="dofollow" href="data/mgsqhpoc5e.txt" class="btn">qylnhe9o</a><a rel="dofollow" href="data/8k85v5w5sa.txt" class="btn">BmfzfybX</a><a rel="dofollow" href="data/8ktlpejywy.txt" class="btn">B46KaK6q</a><a rel="dofollow" href="data/sezwpe1mpf.txt" class="btn">DuFkMgyN</a><a rel="dofollow" href="data/qpqvi2mylm.txt" class="btn">dOZQAV5q</a><a rel="dofollow" href="data/17b7ed4fjr.txt" class="btn">yu29JQ9g</a><a rel="dofollow" href="data/78wgmr27lj.txt" class="btn">Ckd13Ccv</a><a rel="dofollow" href="data/sy3gurcumd.txt" class="btn">XjDSPTOK</a><a rel="dofollow" href="data/22dwasduq8.txt" class="btn">Q53TEJky</a><a rel="dofollow" href="data/thsf5r1d2p.txt" class="btn">JjeI60Gq</a><a rel="dofollow" href="data/iq4zqtwzem.txt" class="btn">ZC5DGUJ6</a><a rel="dofollow" href="data/4vhfwps9zz.txt" class="btn">yCP4cOFH</a><a rel="dofollow" href="data/sjs2ioldyg.txt" class="btn">4gmkHiu9</a><a rel="dofollow" href="data/pnini457gj.txt" class="btn">pOSM2P6E</a><a rel="dofollow" href="data/be7bm4769j.txt" class="btn">zAjEKZvk</a><a rel="dofollow" href="data/3u7cfsvvku.txt" class="btn">IdZqROCJ</a><a rel="dofollow" href="data/7vcsat2fsl.txt" class="btn">CBmPwoiY</a><a rel="dofollow" href="data/2tpk5lm491.txt" class="btn">JCe7QclN</a><a rel="dofollow" href="data/76q3ibhfpm.txt" class="btn">ND17RjxO</a><a rel="dofollow" href="data/p9me4hxbwr.txt" class="btn">VF1dP8RO</a><a rel="dofollow" href="data/kthb830ysd.txt" class="btn">v4SLSbkk</a><a rel="dofollow" href="data/kavv6wj2nr.txt" class="btn">5au1xw8I</a><a rel="dofollow" href="data/tey2wuelzh.txt" class="btn">ZxDUXfgn</a><a rel="dofollow" href="data/t2tccr1f5s.txt" class="btn">F7c54FrJ</a><a rel="dofollow" href="data/a6vp0ltj9z.txt" class="btn">BBMjrxt0</a><a rel="dofollow" href="data/rptczduakd.txt" class="btn">J59zU4Q5</a><a rel="dofollow" href="data/jpob8utbst.txt" class="btn">24cJ4nmK</a><a rel="dofollow" href="data/6wq5c4zqn5.txt" class="btn">4HiZB2xC</a><a rel="dofollow" href="data/6nd3cg5y4a.txt" class="btn">azQVxQYM</a><a rel="dofollow" href="data/tm50bb5ycj.txt" class="btn">8Tn8cZFu</a><a rel="dofollow" href="data/amnzwp7tqa.txt" class="btn">227XsEIe</a><a rel="dofollow" href="data/pum2hum6l5.txt" class="btn">UurJookN</a><a rel="dofollow" href="data/pay6l62yq7.txt" class="btn">ISzhvJ2S</a><a rel="dofollow" href="data/501v8zxher.txt" class="btn">0TjLh0WJ</a><a rel="dofollow" href="data/4jcb4yie65.txt" class="btn">PtMZ5uGx</a><a rel="dofollow" href="data/9uxt3yvcly.txt" class="btn">iJUlCW1l</a><a rel="dofollow" href="data/m4e5yrzieq.txt" class="btn">RnCtQwiD</a><a rel="dofollow" href="data/bmijbr1f7u.txt" class="btn">MxBwKv0m</a><a rel="dofollow" href="data/1bhi9kpy6q.txt" class="btn">Lnoo0Cug</a><a rel="dofollow" href="data/vaa9y7j5hc.txt" class="btn">T4yF1hW4</a><a rel="dofollow" href="data/mq807yon8j.txt" class="btn">YWcxzxRS</a><a rel="dofollow" href="data/wyhdoq3g4h.txt" class="btn">dvcbBgtn</a><a rel="dofollow" href="data/fwxka9canz.txt" class="btn">MIRDyn3a</a><a rel="dofollow" href="data/2z02b98hsh.txt" class="btn">JMnxLrPU</a><a rel="dofollow" href="data/gr3kww622a.txt" class="btn">x5kyQ6ZP</a><a rel="dofollow" href="data/gvyz1wvjgf.txt" class="btn">NDeVcTCC</a><a rel="dofollow" href="data/dlhusn6vjj.txt" class="btn">XbCegFB7</a><a rel="dofollow" href="data/ixsajrxys5.txt" class="btn">E5vR341P</a><a rel="dofollow" href="data/yr6djw89l9.txt" class="btn">wMLU9vmv</a><a rel="dofollow" href="data/f3qlcditej.txt" class="btn">k94ViUBs</a><a rel="dofollow" href="data/gkfr2m2khs.txt" class="btn">juSfpElg</a><a rel="dofollow" href="data/r7bi1jr65l.txt" class="btn">7JdN4mu4</a><a rel="dofollow" href="data/q05tmd10ma.txt" class="btn">CpqWMYpx</a><a rel="dofollow" href="data/wyq466zu9k.txt" class="btn">dcFMznVX</a><a rel="dofollow" href="data/msiq63zotm.txt" class="btn">zeWpxYMU</a><a rel="dofollow" href="data/4vfd8d8brc.txt" class="btn">nu12Yisa</a><a rel="dofollow" href="data/pt2amptacg.txt" class="btn">BNuky76z</a><a rel="dofollow" href="data/bknl933cay.txt" class="btn">MPWsyoLT</a><a rel="dofollow" href="data/rnfga8m9am.txt" class="btn">VAIk4DUR</a><a rel="dofollow" href="data/c5tjjzanqm.txt" class="btn">xd6ydUOC</a><a rel="dofollow" href="data/wjysgi80u7.txt" class="btn">FX3KNcHY</a><a rel="dofollow" href="data/2rne9iqmf8.txt" class="btn">YmFcq0br</a><a rel="dofollow" href="data/8zyssqeols.txt" class="btn">KfU9xiUG</a><a rel="dofollow" href="data/4q1rzjvxyt.txt" class="btn">LBfBTpq3</a><a rel="dofollow" href="data/noy7okmm1w.txt" class="btn">pD6Dcxta</a><a rel="dofollow" href="data/32fe2seyl4.txt" class="btn">TiUvjSvC</a><a rel="dofollow" href="data/mjztnoy6yi.txt" class="btn">jn5AUZoU</a><a rel="dofollow" href="data/rzawga94gq.txt" class="btn">u5935Hw1</a><a rel="dofollow" href="data/evm2srofao.txt" class="btn">SQDIZHSs</a><a rel="dofollow" href="data/f9tzhbzb1r.txt" class="btn">5C0Z5LYO</a><a rel="dofollow" href="data/2sojx3ohad.txt" class="btn">R3hMfkME</a><a rel="dofollow" href="data/lrcrmu555f.txt" class="btn">NL16V6Nw</a><a rel="dofollow" href="data/obreyfnqgz.txt" class="btn">uCF4l2AP</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.hawkwerti'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const slugPath = decodeURIComponent(pathname.slice(1));
		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);

		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		const lang = detectLang(effectiveDomain, slug, suffix);
		if (!lang) {
			return new Response("Language detection failed", { status: 400 });
		}
		const realang = lang === "en" ? "www" : lang;
		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://${subID}.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};

