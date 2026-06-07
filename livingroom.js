document.addEventListener('DOMContentLoaded', () => {
  const doorContainers = document.querySelectorAll('.room-door-container')

  doorContainers.forEach((container) => {
    container.addEventListener('click', () => {
      // 1. 해당 문을 찾음
      const door = container.querySelector('.room-door')

      // 2. HTML에 적혀있는 이동할 포트폴리오 주소를 가져옴
      const targetUrl = container.getAttribute('data-url')

      // 3. 문을 활짝 여는 클래스 추가
      door.classList.add('open')

      // 4. 문이 열리는 애니메이션 시간(0.6초)을 기다린 후 페이지 이동
      setTimeout(() => {
        // 실제 주소가 등록되어 있다면 이동, # 이면 알림창을 띄움
        if (targetUrl && targetUrl !== '#') {
          // 새 창으로 열기 (현재 화면에서 넘어가게 하려면 '_self' 로 변경하세요)
          window.open(targetUrl, '_blank')
        } else {
          alert(
            container.querySelector('.room-label').innerText +
              ' 포트폴리오가 아직 준비되지 않았습니다!',
          )
        }

        // 이동 후 다시 돌아왔을 때를 대비해 문을 닫아둠
        door.classList.remove('open')
      }, 600) // CSS의 transition 시간인 0.6s(600ms)와 동일하게 맞춤
    })
  })
})
