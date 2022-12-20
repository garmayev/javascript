$(() => {
    const count = 11;
    for (let i = 0; i < count; i++) {
        $('.product-list').append('<div class="product-item"><p>'+ (i + 1) +'</p></div>');
    }

    $('.theme').on('click', (e) => {
        e.preventDefault();
        let target = $(e.currentTarget);
        let wrapper = $("."+target.attr('data-target'));
        if ( wrapper.hasClass('white') || wrapper.hasClass('black') ) {
            wrapper.removeClass('white');
            wrapper.removeClass('black');
        }
        wrapper.addClass(target.attr('data-theme'))
    })
})