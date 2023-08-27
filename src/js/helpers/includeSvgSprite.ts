export function includeSvgSprite() {
    let svgIcons = require.context('../../assets/svg/', true, /\.svg$/)
    svgIcons.keys().forEach(svgIcons);
}