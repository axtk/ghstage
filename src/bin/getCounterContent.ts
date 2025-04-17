import {getConfig} from './getConfig';

export async function getCounterContent() {
    let {ymid} = await getConfig();

    if (!ymid)
        return '';

    return `
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${ymid}, "init", {clickmap: true, trackLinks: true, accurateTrackBounce: true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${ymid}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
<script>(function(){window.sendHit=function(){let h=document.querySelector('main section.active h2');ym(${ymid},'hit',window.location.href,{title:(h?h.textContent.trim():'')||'(Start page)',referer:document.referrer});};})();</script>
        `.trim() + '\n';
}
