import { Controller } from "@hotwired/stimulus"
import debounce from "@lodash/debounce"

export default class extends Controller {
    static targets = [ "selected", "input", "suggestion", "template" ]
    static values = { 
        suggest: Object, 
        name: String, 
        multiple: Boolean, 
        items: Array 
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
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
            const csrfToken = document.querySelector("[name='csrf-token']")?.content
            const searchKey = this.inputTarget.value.replaceAll(/[^\w]/g, '')
            const format = this.suggestValue["format"] == null ? "" : `.${this.suggestValue["format"]}`
            const suggestQuery = this.suggestValue["url"] + format + `?key=${searchKey}`

            fetch(suggestQuery, {
                method: this.suggestValue["method"] || 'get',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': this.suggestValue["content-type"] || 'application/json',
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
                            this.insertSuggestItem(item.value, item.text)
                        })
                    } else {
                        this.suggestionTarget.innerHTML = result
                    }

                    this.suggestionTarget.classList.remove("select7-hidden")
                } else {
                    this.suggestionTarget.classList.add("select7-hidden")
                }
            })
        }, 200) // debounce 200
    }

    selectTag(e) {
        const selectedView = e.target

        const input = document.createElement("input")
        input.setAttribute("type", "hidden")
        input.setAttribute("value", selectedView.getAttribute("value"))
        input.setAttribute("name", this.nameValue.replace("[]", `[${this.count}]`))

        const selectedItem = this.templateTarget.cloneNode(true)
        selectedItem.appendChild(input)
        selectedItem.insertAdjacentHTML("afterbegin", selectedView.innerHTML)
        selectedItem.classList.remove("select7-hidden")
        this.selectedTarget.appendChild(selectedItem)
        
        this.inputTarget.value = ""

        if (!this.multipleValue) {
            this.inputTarget.classList.add("select7-invisible")
        }

        this.suggestionTarget.classList.add("select7-hidden")

        this.count--
    }

    removeTag(e) {
        const removeView = e.target.parentElement

        if (removeView.hasAttribute("data-remove-id")) {
            const input = document.createElement("input")
            input.setAttribute("type", "hidden")
            input.setAttribute("name", removeView.getAttribute("data-remove-id"))
            input.setAttribute("value", removeView.getAttribute("data-remove-value"))

            this.selectedTarget.appendChild(input)
            removeView.querySelectorAll('input').forEach(v => this.selectedTarget.appendChild(v))
        }

        this.selectedTarget.removeChild(removeView)
        this.inputTarget.classList.remove("select7-invisible")
    }

    clearForm() {
        this.selectedTarget.innerHTML = ""
    }

    insertSuggestItem(value, text) {
        const optionItem = document.createElement("div")
        optionItem.setAttribute("value", value)
        optionItem.setAttribute("data-action", "click->select7#selectTag")
        optionItem.setAttribute("class", "select7-option-item")
        optionItem.innerText = text
        
        this.suggestionTarget.appendChild(optionItem)
    }
}
