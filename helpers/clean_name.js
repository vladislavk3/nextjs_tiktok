export function clean_name(name) {
    if(name == undefined) { return name; }
    if(name[0] == '@' || name[0] == '#') { return do_clean(name.slice(1,99))}
    return do_clean(name);
}


function do_clean(name) {
    return encodeURIComponent(name.trim().toLowerCase())
}