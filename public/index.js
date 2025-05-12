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
        $(".container-box-link").append(`<p>Please add a valid link</p>`);
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

$(document).on("click", ".copy-button", async function () {
    const shortUrl = $(this).siblings(".short-link").attr("href");
    try {
        await navigator.clipboard.writeText(shortUrl);
        $(this).text("Copied!");
        setTimeout(() => {
            $(this).text("Copy");
        }, 1000);
    } catch (err) {
        console.error("Erro ao copiar para a área de transferência:", err);
        $(this).text("Error");
        setTimeout(() => {
            $(this).text("Copy");
        }, 1000);
    }
});

// social media icons :hover
$(".social-media-icon").hover(
    function () {
      const src = $(this).attr("src").replace("white-icons", "cyan-icons");
      $(this).attr("src", src);
    },
    function () {
      const src = $(this).attr("src").replace("cyan-icons", "white-icons");
      $(this).attr("src", src);
    }
);
  
// Export generated links JSON

$(".export-links-button").on("click", function () {
    const savedLinks = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
    if (savedLinks.length === 0) {
        alert("No links to export.");
        return;
    }
    const dataStr = JSON.stringify(savedLinks, null, 2); // bonito e legível
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shortened-links.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});