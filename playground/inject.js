document.getElementById('app').innerHTML = 'Hello world.';
function test() {
    inject();
    console.log('Inject success.');
}
function inject() {
    console.log('Inject content.');
}
test();
