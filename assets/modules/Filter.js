export default class Filter{

    /**
     * @type {HTMLElement}
     */
    #pagination
    /**
     * @type {HTMLElement}
     */
    #content
    /**
     * @type {HTMLElement}
     */
    #sorting
    /**
     * @type {HTMLFormElement}
     */
    #form


    /**
     * @param  {HTMLElement|null} element
     */
    constructor(element) {
        if (element === null) {
            return
        }
        this.#pagination = element.querySelector('.js-filter-pagination')
        this.#content = element.querySelector('.js-filter-content')
        this.#sorting = element.querySelector('.js-filter-sorting')
        this.#form = element.querySelector('.js-filter-form')
        this.#bindEvents()
    }
    /**
     * Ajoute les comportements aux différents éléments
     */
    #bindEvents(){
        const aClickListener = e => {
            if (e.target.tagName === 'A') {
                e.preventDefault()
                this.#loadUrl(e.target.getAttribute('href'))
            }
        }
        this.#sorting.addEventListener('click', aClickListener)
        this.#pagination.addEventListener("click", aClickListener)
        this.#form.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', this.#loadForm.bind(this))
        })
    }

    async #loadForm() {
        const data = new FormData(this.#form)
        const url = new URL(this.#form.getAttribute('action') || window.location.href)
        const params = new URLSearchParams()
        data.forEach((value, key) => {
            params.append(key, value)
        })
        return this.#loadUrl(`${url.pathname}?${params.toString()}`)
    }

    async #loadUrl (url){
        const ajaxUrl = `${url}&ajax=1`
        const response = await fetch(ajaxUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        if (response.status >= 200 && response.status < 300) {
            const data = await response.json()
            this.#content.innerHTML = data.content
            this.#sorting.innerHTML = data.sorting
            this.#pagination.innerHTML = data.pagination
            history.replaceState({}, '', url)
        }else{
            console.error(response)
        }
    }

}