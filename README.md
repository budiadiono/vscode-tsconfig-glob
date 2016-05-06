# tsconfig-glob
## Generate files value on tsconfig.json based on filesGlob.

You can specify a `filesGlob` pattern in your `tsconfig.json` files and this extension automatically generate list of files. 
Yes just like in [atom-typescript](https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md) plugin when you are using **Atom** editor.

### rewriteTsconfig
You can disable this extension by set this option to `false` in your `tsconfig.json`:
```
{
	"vscode" : {
		"rewriteTsconfig" : false
	}
}
```

**Enjoy!**