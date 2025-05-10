$(document).ready(function () {
    const input = $('.input-link');
    const button = $('.button-shorten-it');

    button.on('click', async function () {
        const originalUrl = input.val().trim();

        // Limpa mensagens anteriores
        $(".container-box-link p").remove();

        // Caso o campo esteja vazio
        if (!originalUrl) {
            console.log("Enter a valid URL");
            $(".container-box-link").append(`<p>Please add link</p>`);
            input.addClass("input-link-error-effect");
            setTimeout(() => {
                input.removeClass("input-link-error-effect");
            }, 800);
            return;
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
                $(".container-list-links").append(`
                    <div class="link-created">
                        <a class="original-link" href="${originalUrl}">${originalUrl}</a>
                        <div class="short-link-and-button">
                            <a class="short-link" href="${data.shortUrl}">${data.shortUrl}</a>
                            <button class="copy-button">Copy</button>
                        </div>
                    </div>
                `)
            } else {
                console.log('Error shortening URL');
                input.addClass("error-effect");
                setTimeout(() => {
                    input.removeClass("error-effect");
                }, 800);
            }
        } catch (error) {
            console.log("Error connecting to server");
            $(".container-box-link").append(`<p>Server error</p>`);
            input.addClass("error-effect");
            setTimeout(() => {
                input.removeClass("error-effect");
            }, 800);
        }
    })
})