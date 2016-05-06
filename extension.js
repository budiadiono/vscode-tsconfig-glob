var vscode = require('vscode');
var Path = require('path')

function activate(context) {
    // Find all tsconfig.json in a workspace    
    vscode.workspace.findFiles('**/tsconfig.json', '**/node_modules/**').then(function (files) {        
        files.forEach(function(file) {            
            start(file.fsPath);
        }, this); 
    }, quit);
}

function start(fileName) {
    // Find tsconfig.json
    var fs = require('fs');
    var tsconfig = JSON.parse(fs.readFileSync(fileName));

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
    var configPath = Path.dirname(fileName)
    watcher.onDidChange(generateFiles(configPath))
    watcher.onDidDelete(generateFiles(configPath))
    watcher.onDidCreate(generateFiles(configPath));       
}

function generateFiles(configPath) {    
    var tsConfig = require("tsconfig-glob");
    
    return function () {
        tsConfig({
            configPath: configPath,
            cwd: process.cwd(),
            indent: 2
        });        
    }
}

function quit(params) {
    // TODO: anything to do?
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;