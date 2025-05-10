$(document).ready(function () {
    const input = $('.input-link');
    const button = $('.button-shorten-it');
    
    function sucessAlert() {
        console.log("Enter a valid URL");
        input.addClass("input-link-sucess-effect");
        setTimeout(() => {
            input.removeClass("input-link-sucess-effect");
        }, 800);
        return;
    }

    function errorAlert() {
        console.log("Enter a valid URL");
        $(".container-box-link").append(`<p>Please add link</p>`);
        input.addClass("input-link-error-effect");
        setTimeout(() => {
            input.removeClass("input-link-error-effect");
        }, 800);
        return;
    }

    button.on('click', async function () {
        const originalUrl = input.val().trim();

        // Limpa mensagens anteriores
        $(".container-box-link p").remove();

        // Caso o campo esteja vazio
        if (!originalUrl) {
            errorAlert();
        }

        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url:originalUrl })
            });

            const data = await response.json();

            if (data.shortUrl) {
                console.log(`Shortened URL: ${data.shortUrl}`);
                sucessAlert();
                $(".container-list-links").append(`
                    <div class="link-created">
                        <a class="original-link" href="${originalUrl}">${originalUrl}</a>
                        <div class="short-link-and-button">
                            <a class="short-link" href="${data.shortUrl}">${data.shortUrl}</a>
                            <button class="copy-button">Copy</button>
                        </div>
                    </div>
                `)
            }
        } catch (error) {
            errorAlert();
        }
    })
})