export { test }
function test(content) {
    const div = document.createElement('div')
    div.textContent = content
    div.classList.add('hi')
    document.body.append(div)
}