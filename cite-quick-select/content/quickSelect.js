const marker = 'CiteAddMonkeyPatched'

function patch(object, method, patcher) {
	debug(`patching ${method}`)
	if (object[method][marker]) return
	object[method] = patcher(object[method])
	object[method][marker] = true
}

patch(Zotero_Citation_Dialog, 'load', original => async function(item, mode, index) {
	Zotero.logError("quickSelect was called")
	await original.apply(this, arguments)
	Zotero.debug(Zotero.getActiveZoteroPane().getSelectedItems()[0])
	if (!window.arguments[0].wrappedJSObject.citation.citationItems.length & Zotero.getActiveZoteroPane().getSelectedItems().length) {
		Zotero.logError("quickSelect did run")
		Zotero.debug("quickSelect did run")
		let key = Zotero.getActiveZoteroPane().getSelectedItems()[0].key
		let id = Zotero.Items.getIDFromLibraryAndKey(Zotero.getActiveZoteroPane().getSelectedLibraryID(), key)
		Zotero.debug(Zotero.getActiveZoteroPane().getSelectedItems()[0])
		collectionsView.selectItem(id)
		document.getElementById('locator').focus()
	}
})

/* function selectFromMainPanel() {
	Zotero.logError("quickSelect was called")
	Zotero.logError(window.arguments[0].wrappedJSObject.citation.citationItems)
	Zotero.logError(Zotero.getActiveZoteroPane().getSelectedItems()[0])
	if (!window.arguments[0].wrappedJSObject.citation.citationItems.length & Zotero.getActiveZoteroPane().getSelectedItems().length) {
		Zotero.logError("quickSelect did run")
		collectionsView.selectItem(Zotero.getActiveZoteroPane().getSelectedItems()[0].key)
		document.getElementById('locator').focus()
	}
}

function override(object, methodName, callback) {
	object[methodName] = callback(object[methodName])
}

function after(extraBehavior) {
	return function(original) {
		return function() {
			var returnValue = await original.apply(this, arguments)
			extraBehavior.apply(this, arguments)
			return returnValue
		}
	}
} */
//override(Zotero_Citation_Dialog, 'load', after(selectFromMainPanel()))
