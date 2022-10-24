$(function () {
    function addMoreTimes() {
        $('.card-content__time-item_more').remove();
        $('.card-content__time-item').show();
        const timesRow = $('.card-content__time');
        const timesRowHeight = timesRow.outerHeight();
        const timesRowWidth = timesRow.outerWidth();
        const timeElem = $('.card-content__time-item');
        const timeElemHeight = timeElem.outerHeight();
        const timeElemWidth = timeElem.outerWidth();
        const rowTimeElemsCout = Math.floor(timesRowWidth / (timeElemWidth + 7));
        const moreElem = $(`<div class="card-content__time-item card-content__time-item_more">еще...</div>`);

        if (timesRowHeight > timeElemHeight + 7) {
            $(`.card-content__time-item:nth-child(n+${rowTimeElemsCout})`).hide();
            if ($('.card-content__time-item_more').length == 0) {
                $(`.card-content__time-item:nth-child(${rowTimeElemsCout})`).before(moreElem);
            }
        }
    }

    $(document).on('click', '.card-content__time-item_more', function () {
        $(this).remove();
        $('.card-content__time-item').show();
    });

    addMoreTimes();
    $(window).resize(addMoreTimes);
})