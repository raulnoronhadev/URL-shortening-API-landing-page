$(document).ready(function () {
    const input = $('#input-link');
    const button = $('#button-shorten-it');

    button.on('click', async function () {
        const originalUrl = input.val().trim();

        if (!originalUrl) {
            console.log("Enter a valid URL");
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
                $(".container-box-link").append(`
                    <p>Please add link</p>
                `);
            }
        } catch (error) {
            console.log("Error connecting to server")
        }
    })
})