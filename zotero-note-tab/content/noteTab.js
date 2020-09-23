const marker = 'ZoteroNoteTabMonkeyPatched'

window.addEventListener('load', event => {
  document.getElementById('zotero-editpane-notes').parentNode.appendChild(document.getElementById('znt-zotero-note-editor'))
  Zotero.debug('znt load')
  Zotero.debug('znt load')
  Zotero.debug('znt load')
  Zotero.debug('znt load')
  Zotero.debug('znt load')
  Zotero.debug('znt load')
}, false)

function patch(object, method, patcher) {
	debug(`patching ${method}`)
	if (object[method][marker]) return
	object[method] = patcher(object[method])
	object[method][marker] = true
}

patch(ZoteroItemPane, 'viewItem', original => async function(item, mode, index) {
	let editable = ZoteroPane_Local.canEdit()
	let notesIndex = -1
	let editPane = document.getElementById('zotero-editpane-notes')
	let noteEditor = document.getElementById('znt-zotero-note-editor')
	//Determine whether we are in the notes tab
	try {
		const tabPanels = document.getElementById('zotero-editpane-tabs')
		notesIndex = Array.from(tabPanels.children).findIndex(child => child.id === 'zotero-editpane-notes-tab')
	} catch (err) {
		Zotero.logError(`ZoteroNoteTab.ZoteroItemPane.viewItem: ${err}`)
		notesIndex = -1
	}
	let notes = await Zotero.Items.getAsync(item.getNotes())
	//If not in notes tab, call the Zotero viewItem function
	if (index !== notesIndex || notes.length !== 1) {
		editPane.hidden = false
		noteEditor.hidden = true
		return await original.apply(this, arguments)
	}
	
	/*Since we're in the notes tab and have exactly one child note,
	we display the note's text if appropriate.*/
	let id = notes[0].id
	if (ZoteroPane.findNoteWindow(id)) {
		this.showNoteWindowMessage();
		return;
	}
	editPane.hidden = true
	noteEditor.hidden = false
	let clearUndo = noteEditor.item ? noteEditor.item.id != id : false
	noteEditor.mode = editable ? 'edit' : 'view'
	//noteEditor.parent = null
	noteEditor.item = notes[0]
	if (clearUndo) {
		noteEditor.clearUndo()
	}
})

/* window.addEventListener('load', event => {
	PPItemPane.load().catch(err => Zotero.logError(err))
}, false)
window.addEventListener('unload', event => {
	PPItemPane.unload().catch(err => Zotero.logError(err))
}, false) */