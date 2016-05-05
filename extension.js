var vscode = require('vscode');

function activate(context) {
    // Start cooking the tsconfig.json
    vscode.workspace.openTextDocument(vscode.workspace.rootPath + '/tsconfig.json').then(start, quit);
}

function start(params) {
    // Find tsconfig.json
    var fs = require('fs');
    var tsconfig = JSON.parse(fs.readFileSync(params.fileName));

    // Ensure vscode.rewriteTsconfig option is not FALSE
    var vcode = tsconfig.vscode;
    if (vcode && vcode.rewriteTsconfig === false) {
        return;
    }

    // Ensure filesGlob is defined
    var filesGlob = tsconfig.filesGlob
    if (!filesGlob || !filesGlob.length) {
        return;
    }

    // Read filesGlob
    var globs = [];
    for (var index = 0; index < filesGlob.length; index++) {
        var glb = filesGlob[index];
        if (!glb.startsWith('!')) {
            globs.push(glb)
        }
    }
    if (!globs.length)
        return;

    // Watch files defined in filesGlob
    var watcher = vscode.workspace.createFileSystemWatcher('{' + globs.join(',') + '}');
    watcher.onDidChange(generateFiles)
    watcher.onDidDelete(generateFiles)
    watcher.onDidCreate(generateFiles);       
}

function generateFiles() {    
    var tsConfig = require("tsconfig-glob");
    tsConfig({
        configPath: vscode.workspace.rootPath,
        cwd: process.cwd(),
        indent: 2
    });
}

function quit(params) {
    // TODO: anything to do?
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;