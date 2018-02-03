import $ from 'jquery';
import zlide from './zlide';
import './demo.scss';

const log = console.log.bind(console);
const state = {
  prev: null,
};

$(() => {
  const $container = $('.container');
  const $copy = $('.block')
    .last()
    .clone();
  $copy.appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);

  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);
  $copy.clone().appendTo($container);

  zlide.rAF(() => {
    $('.details').each((i, el) => {
      el.style.display = 'none  !important';
      zlide.setToCollapsed({
        doneCallback: () => el.style.display = '',
        element: el,
      });
    });
    $container.attr('data-zlide-ready', '1');
  });

  $('.box').each((i, el) => {
    const $box = $(el);
    const number = i + 1;
    $box.attr('data-box', number);
    // $box.addClass('box--' + number);
    $box.html(`<span>item ${number}</span>`);
  });

  $('.details').each((i, el) => {
    const $details = $(el);
    const number = i + 1;
    $details.attr('data-details', number);
    // $details.addClass('details--' + number);
    $details.html(`
    <div class="content">
        <div class="content__body">
          <p>details ${number}</p>
          <button>a button</button>
        </div>
        <img src='https://images.unsplash.com/photo-1429087969512-1e85aab2683d?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=212fa0707ebff5a371442c8f4242d600'/>
    </div>
    `);
  });

  // $('.block').each((blockIndex, block) => {
  //   let $block = $(block);
  //   $block.addClass('block--' + (blockIndex + 1));
  // });

  $('.box').each((i, el) => {
    const $box = $(el);
    $box.click(e => {
      const isReady = $container.attr('data-zlide-ready');
      if (isReady !== '1') {
        log('not ready');
        return;
      }

      let $block = $box.closest('.block').first();
      let number = $box.attr('data-box');
      let $details = $block.find('[data-details=' + number + ']').first();
      // let $content = $details.find('.content').first();

      $box.toggleClass('is-active');

      $container.attr('data-zlide-ready', '0');
      zlide.toggle({
        beforeCallback: props => {},
        doneCallback: props => {
          $container.attr('data-zlide-ready', '1');
        },
        element: $details[0],
      });

      if (state.prev && number !== state.prev) {
        let $prevDetails = $('[data-details=' + state.prev + ']').first();
        // let $prevContent = $prevDetails.find('.content').first();

        if (!$prevDetails.hasClass('zlide-inert')) {
          zlide.toggle({
            beforeCallback: () => {},
            doneCallback: () => {},
            element: $prevDetails[0],
          });
          $('[data-box=' + state.prev + ']')
            .first()
            .removeClass('is-active');
        }
      }

      state.prev = number;
    });
  });
});
