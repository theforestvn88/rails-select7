export const Select7Controller = (base, debounce) => 
    class extends base {
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

            document.addEventListener('click', this.outsideClick.bind(this))
        }

        disconnect() {
            document.removeEventListener('click', this.outsideClick.bind(this))
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
                const matchedItems = this.itemsValue.filter(([value, text, lowcaseText]) => lowcaseText.includes(key))
                if (matchedItems.length > 0) {
                    matchedItems.forEach(([value, text, x]) => this.insertSuggestItem(value, text))
                    this.showSuggestion()
                }
            } else {
                this.hideSuggestion()
            }
        }

        remoteSuggest() {
            const searchKey = this.inputTarget.value.replaceAll(/[^\w]/g, '')
            if (searchKey.length <= 0)
                return

            const csrfToken = document.querySelector("[name='csrf-token']")?.content
            const format = this.suggestValue["format"] || "html"
            const contentType = this.suggestValue["content-type"] || this.constructor.formats[format]
            const suggestQueryUrl = new URL(this.suggestValue["url"])
            suggestQueryUrl.searchParams.append(this.textAttrValue, searchKey)

            fetch(suggestQueryUrl, {
                method: this.suggestValue["method"] || 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Accept': contentType,
                    'Content-Type': contentType,
                    'X-CSRF-Token': csrfToken,
                }
            })
            .then((r) => r.text())
            .then((result) => {
                if (result) {
                    this.suggestionTarget.innerHTML = ""
                    if (this.suggestValue["format"] == "json") {
                        const items = JSON.parse(result)
                        if (items.length > 0) {
                            items.forEach(item => {
                                this.insertSuggestItem(item[this.valueAttrValue], item[this.textAttrValue])
                            })
                            this.showSuggestion()
                        }
                    } else {
                        this.suggestionTarget.innerHTML = result
                        this.showSuggestion()
                    }
                } else {
                    this.hideSuggestion()
                }
            })
        }

        insertSuggestItem(value, text) {
            const displayText = this.selectedItems.find(item => item[0] == value) ? `✓ ${text}` : text
            const optionItem = document.createElement("div")
            optionItem.setAttribute("value", value)
            optionItem.setAttribute("data-action", "click->select7#selectTag")
            optionItem.setAttribute("class", "select7-option-item")
            optionItem.innerText = displayText
            
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
            
            this.hideSuggestion()

            this.inputTarget.value = ""
            if (!this.multipleValue) {
                this.inputTarget.classList.add("select7-invisible")
            }
            this.inputTarget.focus()
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

        showSuggestion() {
            this.suggestionTarget.classList.remove("select7-hidden")
            this.suggestionTarget.scrollTo(0, 0)
        }

        hideSuggestion() {
            this.suggestionTarget.classList.add("select7-hidden")
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
                    changedValue: value,
                    selectedValues: this.selectedItems.map(item => item[0])
                }
            })
            window.dispatchEvent(changedEvent)
        }

        handleKeyUp(event) {
            if (event.code == "Escape") {
                this.hideSuggestion()
            }
        }

        outsideClick(event) {
            if (!event.composedPath().includes(this.element)) {
                this.hideSuggestion()
            }
        }
    }
