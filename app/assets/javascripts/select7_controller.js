import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "selected", "input", "suggestion", "template" ]
    static values = { suggestApi: String, name: String, multiple: Boolean, items: Array }

    connect() {
        this.count = 0
        this.timeoutId = null
        this.element.addEventListener("turbo:submit-end", this.clearForm.bind(this))
        if (this.hasInputTarget) {
            this.inputTarget.setAttribute("autocomplete", "off")
        }
    }

    suggest() {
        if (this.suggestApiValue && this.suggestApiValue != "") {
            this.remoteSuggest()
        } else if (this.hasItemsValue) {
            this.localSuggest()
        }
    }

    localSuggest() {
        const key = this.inputTarget.value.toLowerCase()
        if (key != "") {
            this.suggestionTarget.innerHTML = ""
            this.itemsValue.forEach(([id, name, lowcaseName]) => {
                if (lowcaseName.includes(key)) {
                    const optionItem = document.createElement("p")
                    optionItem.setAttribute("value", id)
                    optionItem.setAttribute("data-action", "click->select7#selectTag")
                    optionItem.setAttribute("class", "select7-option-item")
                    optionItem.innerText = name
                    
                    this.suggestionTarget.appendChild(optionItem)
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
            let searchKey = this.inputTarget.value.replaceAll(/[^\w]/g, '')
            let suggestQuery = this.suggestApiValue + `?key=${searchKey}`
            fetch(suggestQuery)
                .then((r) => r.text())
                .then((html) => {
                    if (html != "") {
                        this.suggestionTarget.innerHTML = html
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
}
