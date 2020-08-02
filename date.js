

module.exports.getDate = getDate;
// or we can just use "exports.getDate = getDate;"

function getDate(){
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today=new Date();

return today.toLocaleDateString("en-US", options);

}

module.exports.Day = Day;
// this funciton for test only 
function Day(){
    return "today"
}