import { Controller } from "@hotwired/stimulus"
import debounce from "@lodash/debounce"

export default class extends Controller {
    static targets = [ "selected", "input", "suggestion", "template" ]
    static values = { 
        scope: String,
        field: String,
        valueAttr: String,
        textAttr: String,
        suggest: Object, 
        inputName: String, 
        multiple: Boolean, 
        nested: Boolean,
        items: Array,
        selectedItems: Array,
    }

    static formats = {
        "json": "application/json",
        "html": "text/html",
        "turbo_stream": "text/vnd.turbo-stream.html"
    }

    connect() {
        this.count = 0
        this.timeoutId = null
        this.element.addEventListener("turbo:submit-end", this.clearForm.bind(this))
        if (this.hasInputTarget) {
            this.inputTarget.setAttribute("autocomplete", "off")
        }

        this.debounceSuggest = debounce(
            this.suggest.bind(this),
            500,
            { 'leading': true }
        )

        this.selectedItems = this.hasSelectedItemsValue ? this.selectedItemsValue.map((v, n, x) => [v, n]) : []
    }

    suggest() {
        if (this.suggestValue["url"]) {
            this.remoteSuggest()
        } else if (this.hasItemsValue) {
            this.localSuggest()
        }
    }

    localSuggest() {
        const key = this.inputTarget.value.toLowerCase()
        if (key != "") {
            this.suggestionTarget.innerHTML = ""
            this.itemsValue.forEach(([value, text, lowcaseText]) => {
                if (lowcaseText.includes(key)) {
                    this.insertSuggestItem(value, text)
                }
            })
            this.suggestionTarget.classList.remove("select7-hidden")
        } else {
            this.suggestionTarget.classList.add("select7-hidden")
        }
    }

    remoteSuggest() {
        const csrfToken = document.querySelector("[name='csrf-token']")?.content
        const searchKey = this.inputTarget.value.replaceAll(/[^\w]/g, '')
        const format = this.suggestValue["format"] || "html"
        const suggestQuery = this.suggestValue["url"] + `?${this.textAttrValue}=${searchKey}`
        const contentType = this.constructor.formats[format]

        fetch(suggestQuery, {
            method: this.suggestValue["method"] || 'get',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': this.suggestValue["content-type"] || contentType,
                'X-CSRF-Token': csrfToken,
            }
        })
        .then((r) => r.text())
        .then((result) => {
            if (result) {
                this.suggestionTarget.innerHTML = ""

                if (this.suggestValue["format"] == "json") {
                    const items = JSON.parse(result)
                    items.forEach(item => {
                        this.insertSuggestItem(item[this.valueAttrValue], item[this.textAttrValue])
                    })
                } else {
                    this.suggestionTarget.innerHTML = result
                }

                this.suggestionTarget.classList.remove("select7-hidden")
            } else {
                this.suggestionTarget.classList.add("select7-hidden")
            }
        })
    }

    insertSuggestItem(value, text) {
        const optionItem = document.createElement("div")
        optionItem.setAttribute("value", value)
        optionItem.setAttribute("data-action", "click->select7#selectTag")
        optionItem.setAttribute("class", "select7-option-item")
        optionItem.innerText = text
        
        this.suggestionTarget.appendChild(optionItem)
    }

    selectTag(e) {
        const selectedView = e.target
        const value = selectedView.getAttribute("value")
        const name = this.inputNameValue.replace("[?]", `[${this.count++}]`)

        if (!this.selectedItems.find(item => item[0] == value)) {
            this.selectedItems.push([value, name])

            const input = document.createElement("input")
            input.setAttribute("type", "hidden")
            input.setAttribute("value", value)
            input.setAttribute("name", name)

            const selectedItem = this.templateTarget.cloneNode(true)
            selectedItem.appendChild(input)
            selectedItem.insertAdjacentHTML("afterbegin", selectedView.innerHTML)
            selectedItem.classList.remove("select7-hidden")
            this.selectedTarget.appendChild(selectedItem)

            this.emitChangedEvent("add", name, value)
        }
        
        this.inputTarget.value = ""

        if (!this.multipleValue) {
            this.inputTarget.classList.add("select7-invisible")
        }
        this.suggestionTarget.classList.add("select7-hidden")
    }

    removeTag(e) {
        const removeView = e.target.parentElement
        const name = removeView.getAttribute("data-remove-id")
        const value = removeView.getAttribute("data-remove-value")

        this.selectedItems = this.selectedItems.filter((_value, _name) => _name == name && value == _value)

        if (removeView.hasAttribute("data-remove-id")) {
            const input = document.createElement("input")
            input.setAttribute("type", "hidden")
            input.setAttribute("name", name)
            input.setAttribute("value", value)

            this.selectedTarget.appendChild(input)
            removeView.querySelectorAll('input').forEach(v => this.selectedTarget.appendChild(v))
        }

        const input = removeView.querySelector('input')
        this.emitChangedEvent("remove", name, value)

        this.selectedTarget.removeChild(removeView)
        this.inputTarget.classList.remove("select7-invisible")
    }

    clearForm() {
        this.selectedTarget.innerHTML = ""
    }

    emitChangedEvent(action, name, value) {
        const changedEvent = new CustomEvent('select7-changed', {
            detail: {
                scope: this.scopeValue,
                field: this.fieldValue,
                action: action,
                change_value: value,
                values: this.selectedItems.map(item => item[0])
            }
        })
        window.dispatchEvent(changedEvent)
    }
}
