$(function () {
  (function () {
    const timeOffset = '+03:00';
    const roadTime = 50;
    const shedule = [
      {
        destination: 'из A в B',
        times: [
          '2021-08-21 18:00:00',
          '2021-08-21 18:30:00',
          '2021-08-21 18:45:00',
          '2021-08-21 19:00:00',
          '2021-08-21 19:15:00',
          '2021-08-21 21:00:00',
        ]
      },
      {
        destination: 'из B в A',
        times: [
          '2021-08-21 18:30:00',
          '2021-08-21 18:45:00',
          '2021-08-21 19:00:00',
          '2021-08-21 19:15:00',
          '2021-08-21 19:35:00',
          '2021-08-21 21:50:00',
          '2021-08-21 21:55:00',
        ]
      }
    ]

    const route = $('#route');
    route.on('change', addTimesOptions);
    const timeSelect = $('#time');

    function addTimesOptions() {
      const routeValue = route.val();
      const timeSelectOptionsGroups = shedule.map(item => {
        let destination = item.destination;
        timeSelectOptions = item.times.map(time => {
          let localTime = moment(time + timeOffset).local();
          let localTimeFormat = localTime.format("HH:mm");
          let timeSelectOption = $(
            `<option value="${localTimeFormat}(${destination})" data-time="${moment(time + timeOffset).local()}">${localTimeFormat}(${destination})
              </option>`
          )
          return timeSelectOption;
        });

        return {
          destination,
          timeSelectOptions
        }
      });

      timeSelect.html('');
      if (routeValue == 'из A в B и обратно в А') {
        timeSelect.append(timeSelectOptionsGroups[0].timeSelectOptions);
        addBackTimeOption();
        timeSelect.on('change', addBackTimeOption);
      } else {
        $('#backTime').remove();
        $('#backTimeLabel').remove();
        timeSelect.off('change', addBackTimeOption);
        timeSelectOptionsGroups.forEach(group => {
          if (routeValue == group.destination) {
            timeSelect.append(group.timeSelectOptions);
          }
        })
      }
    }
    addTimesOptions();

    function addBackTimeOption() {
      const firstTimeSelectValue = $('#time option:selected').data('time');
      const time = moment(firstTimeSelectValue);
      const arriveTime = time.add(roadTime, 'm');
      const backTimesOptions = [];

      shedule.forEach(item => {
        let destination = item.destination;
        if (destination == 'из B в A') {
          item.times.forEach(timeItem => {

            let localTime = moment(timeItem + timeOffset).local();
            if (moment(localTime).isAfter(arriveTime) == true) {
              let localTimeFormat = localTime.format("HH:mm");
              let timeSelectOption = $(
                `<option value="${localTimeFormat}(${destination})" data-time="${localTime}">${localTimeFormat}(${destination})
                  </option>`
              )
              backTimesOptions.push(timeSelectOption);
            }
          });
        }
      })

      const backTimesSelect = $(`
      <select name="backTime" id="backTime">
      </select > `);
      const backTimesLabel = $(`<label class="calc-label" id="backTimeLabel" for="backTime">Выберите время возвращения</label>`);

      backTimesSelect.append(backTimesOptions);
      $('#backTime').remove();
      $('#backTimeLabel').remove();
      timeSelect.after(backTimesSelect);
      backTimesSelect.before(backTimesLabel);
    }

    $('#get-calc').on('click', function () {
      const routeValue = route.val();
      const routePrice = $('#route option:selected').data('price');
      const ticketCount = $('#num').val();
      const departureTime = $('#time option:selected').data('time');
      const departureTimeFormat = moment(departureTime).format('HH-mm');
      const backTime = $('#backTime option:selected').data('time');
      const backTimeFormat = moment(backTime).format('HH-mm');
      const arriveTime = moment(departureTime).add(roadTime, 'm');
      const arriveTimeFormat = moment(arriveTime).format('HH-mm');
      let resultText;

      const totalRoadTime = backTime ? roadTime * 2 : roadTime;
      const backTimeText = backTime ? `Время отправки в обратный путь ${backTimeFormat}.` : '';

      if (ticketCount < 1) {
        resultText = $(`<p class="text" id="calc-result">Введите количество билетов.</p>`);
      } else {
        const totalPrice = routePrice * ticketCount;
        const nameTicketInText = nameTicket(ticketCount);

        resultText = $(`<p class="text" id="calc-result">Вы выбрали ${ticketCount} ${nameTicketInText} по маршруту ${routeValue} стоимостью ${totalPrice}р.
      Это путешествие займет у вас ${totalRoadTime} минут. 
      Теплоход отправляется в ${departureTimeFormat}, а прибудет в ${arriveTimeFormat}.
      ${backTimeText}</p>`);
      }

      function nameTicket(count) {
        if (count == 1 || count == 21 || count == 31 || count == 41) {
          return 'билет'
        } else if (count > 1 && count <= 4) {
          return 'билета'
        } else if (count >= 5 && count <= 20) {
          return 'билетов'
        } else {
          return 'шт. билетов'
        }
      }


      $('#calc-result').remove();
      $('#calc').append(resultText);
    })
  })()
})