$(".get-started-button").on("click", () => {
    $('html, body').animate({
        scrollTop: $(".infos-wrapper").offset().top
    }, 600);
});

$(document).ready(function () {
    const input = $('.input-link');
    const button = $('.button-shorten-it');
    
    let savedLinks = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
    savedLinks.forEach(link => {
        $(".container-list-links").append(`
            <div class="link-created">
                <a class="original-link" href="${link.originalUrl}">${link.originalUrl}</a>
                <div class="short-link-and-button">
                    <a class="short-link" href="${link.shortUrl}">${link.shortUrl}</a>
                    <button class="copy-button">Copy</button>
                    <button class="delete-button" data-url="${link.shortUrl}">Delete</button>
                </div>
            </div>
        `);
    });

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

        // Clen messages
        $(".container-box-link p").remove();

        // If field is empty
        if (!originalUrl) {
            errorAlert();
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
                sucessAlert();
                $(".container-list-links").append(`
                    <div class="link-created">
                        <a class="original-link" href="${originalUrl}">${originalUrl}</a>
                        <div class="short-link-and-button">
                            <a class="short-link" href="${data.shortUrl}">${data.shortUrl}</a>
                            <button class="copy-button">Copy</button>
                            <button class="delete-button" data-url="${data.shortUrl}">Delete</button>
                        </div>
                    </div>
                `)
                let savedLinks = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
                savedLinks.push({ originalUrl, shortUrl: data.shortUrl });
                localStorage.setItem("shortenedLinks", JSON.stringify(savedLinks));    
            }
            else {
                errorAlert();
            }
        } catch (error) {
            errorAlert();
        }
    })
})

$(document).on("click", ".delete-button", function () {
    const shortUrl =  $(this).data("url");
    if (!shortUrl) return;
    let storedLinks = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
    let updatedLinks = storedLinks.filter(link => link.shortUrl !== shortUrl);    
    localStorage.setItem("shortenedLinks", JSON.stringify(updatedLinks));
    $(this).closest(".link-created").remove();
});

// NOVO PROBLEMA: QUANDO 1 LINK É DELETADO E A PÁGINA
// É ATUALIZADA, TODOS OS LINKS SOMEM