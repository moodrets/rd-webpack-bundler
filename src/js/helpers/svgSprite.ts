export function includeSvgSprite() {
    let svgIcons = require.context('../../assets/icons/', true, /\.svg$/)
    svgIcons.keys().forEach(svgIcons);
}

export async function getSvgSprite() {
    let spriteFromStorage = localStorage.getItem('svgSprite')

    if (spriteFromStorage) {
        document.body.insertAdjacentHTML('afterbegin', spriteFromStorage)
    } else {
        let res = await fetch('/svg-sprite/sprite.svg')
        let resText = await res.text()
        localStorage.setItem('svgSprite', resText)
    }
}