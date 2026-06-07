// 1. 식재료 정보 및 데이터
const foodData = {
  김치: {
    img: '김치.jpg',
    fridge: '냉장: 6개월 ~ 1년',
    freezer: '냉동 비권장',
    room: '실온 (빨리 쉼!)',
  },
  물: {
    img: '물병.jpg',
    fridge: '냉장: 6개월',
    freezer: '냉동 가능(팽창)',
    room: '상온 (안전)',
  },
  고기: {
    img: '고기.jpg',
    fridge: '냉장: 3~5일',
    freezer: '냉동: 6~12개월',
    room: '실온 (부패 위험!)',
  },
  야채: {
    img: '야채.avif',
    fridge: '냉장: 5~7일',
    freezer: '냉동: 8~12개월',
    room: '실온 (시듦!)',
  },
  계란: {
    img: '계란.jpg',
    fridge: '냉장: 3~5주',
    freezer: '냉동: 1년',
    room: '실온 (빠른 섭취)',
  },
  사과: {
    img: '사과.jpg',
    fridge: '냉장: 3~4주',
    freezer: '냉동: 10~12개월',
    room: '실온 (벌레 꼬임)',
  },
}

let itemCount = 0

// 2. 아이템 생성 함수
function addItem() {
  const select = document.getElementById('item-select')
  const itemName = select.value
  const data = foodData[itemName]

  const itemBox = document.createElement('div')
  itemBox.className = 'food-item'
  itemBox.id = 'item-' + itemCount++
  itemBox.draggable = true
  itemBox.dataset.name = itemName

  const imgElement = document.createElement('img')
  imgElement.src = data.img
  imgElement.className = 'food-img'

  const tooltip = document.createElement('span')
  tooltip.className = 'tooltip'
  tooltip.textContent = data.room
  tooltip.style.backgroundColor = itemName === '물' ? '#6c757d' : '#dc3545'

  itemBox.appendChild(imgElement)
  itemBox.appendChild(tooltip)

  // --- PC 마우스 드래그 이벤트 ---
  itemBox.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', itemBox.id)
    setTimeout(() => itemBox.classList.add('dragging'), 0)
  })
  itemBox.addEventListener('dragend', () =>
    itemBox.classList.remove('dragging'),
  )

  // --- 📱 모바일 터치 드래그 이벤트 ---
  itemBox.addEventListener('touchstart', handleTouchStart, { passive: false })
  itemBox.addEventListener('touchmove', handleTouchMove, { passive: false })
  itemBox.addEventListener('touchend', handleTouchEnd)

  document.getElementById('table-zone').appendChild(itemBox)
}

document.getElementById('add-btn').addEventListener('click', addItem)

// 3. 서랍 여닫기
document.querySelectorAll('.drawer-front').forEach((front) => {
  front.addEventListener('click', () => {
    front.closest('.drawer-container').classList.toggle('open')
  })
})

// 4. 공통 드롭 로직 (PC와 모바일에서 함께 사용)
function processDrop(draggedElement, dropTarget) {
  // 쓰레기통 처리
  if (dropTarget.closest('#trash-bin')) {
    draggedElement.remove()
    return
  }
  // 서랍 닫힘 처리
  if (dropTarget.classList.contains('drawer-body')) {
    if (!dropTarget.closest('.drawer-container').classList.contains('open')) {
      alert('서랍이 닫혀있습니다! 열고 넣어주세요.')
      return
    }
  }

  dropTarget.appendChild(draggedElement)

  // 유통기한 말풍선 업데이트
  const itemName = draggedElement.dataset.name
  const tooltip = draggedElement.querySelector('.tooltip')

  if (dropTarget.closest('.left-half')) {
    tooltip.textContent = foodData[itemName].freezer
    tooltip.style.backgroundColor = '#17a2b8'
  } else if (dropTarget.closest('.right-half')) {
    tooltip.textContent = foodData[itemName].fridge
    tooltip.style.backgroundColor = '#28a745'
  } else {
    tooltip.textContent = foodData[itemName].room
    tooltip.style.backgroundColor = itemName === '물' ? '#6c757d' : '#dc3545'
  }
}

// PC 드래그 앤 드롭 존 설정
document.querySelectorAll('.drop-zone').forEach((zone) => {
  zone.addEventListener('dragover', (e) => e.preventDefault())
  zone.addEventListener('drop', (e) => {
    e.preventDefault()
    const draggedElement = document.getElementById(
      e.dataTransfer.getData('text/plain'),
    )
    const dropTarget = e.target.closest('.drop-zone')
    if (draggedElement && dropTarget) processDrop(draggedElement, dropTarget)
  })
})

// --- 📱 모바일 터치 처리 함수 ---
let touchActiveItem = null

function handleTouchStart(e) {
  touchActiveItem = e.target.closest('.food-item')
  if (touchActiveItem) {
    touchActiveItem.classList.add('dragging')
    e.preventDefault() // 화면 스크롤 방지
  }
}

function handleTouchMove(e) {
  if (!touchActiveItem) return
  e.preventDefault()
  const touch = e.touches[0]

  // 터치 위치에 따라 아이템이 손가락을 따라오게 절대좌표 변경
  touchActiveItem.style.position = 'fixed'
  touchActiveItem.style.left =
    touch.clientX - touchActiveItem.offsetWidth / 2 + 'px'
  touchActiveItem.style.top =
    touch.clientY - touchActiveItem.offsetHeight / 2 + 'px'
}

function handleTouchEnd(e) {
  if (!touchActiveItem) return
  touchActiveItem.classList.remove('dragging')

  // 아이템을 잠깐 숨겨서 손가락 아래에 있는 '드롭존'을 찾아냄
  touchActiveItem.style.display = 'none'
  const touch = e.changedTouches[0]
  let elemUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
  touchActiveItem.style.display = 'flex'

  // 아이템을 원래 흐름으로 복구
  touchActiveItem.style.position = ''
  touchActiveItem.style.left = ''
  touchActiveItem.style.top = ''

  if (elemUnderTouch) {
    const dropTarget = elemUnderTouch.closest('.drop-zone')
    if (dropTarget) {
      processDrop(touchActiveItem, dropTarget)
    }
  }
  touchActiveItem = null
}

// 5. 저메추 룰렛 기능
document.getElementById('mini-roulette-btn').addEventListener('click', (e) => {
  e.preventDefault()
  document.getElementById('roulette-modal').classList.add('show')
})

document.getElementById('close-roulette-btn').addEventListener('click', () => {
  document.getElementById('roulette-modal').classList.remove('show')
})

let currentRotation = 0
let isSpinning = false

document.getElementById('spin-btn').addEventListener('click', () => {
  if (isSpinning) return
  isSpinning = true

  const wheel = document.getElementById('main-roulette-wheel')
  const resultText = document.getElementById('roulette-result')

  resultText.style.color = '#333'
  resultText.textContent = '돌아가는 중... 두구두구🥁'

  const spinAngle = Math.floor(Math.random() * 360) + 3600
  currentRotation += spinAngle
  wheel.style.transform = `rotate(${currentRotation}deg)`

  setTimeout(() => {
    const norm = currentRotation % 360
    const topAngle = (360 - norm) % 360
    const index = Math.floor(topAngle / 45)
    const menus = [
      '치킨',
      '피자',
      '족발',
      '삼겹살',
      '햄버거',
      '떡볶이',
      '샐러드',
      '마라탕',
    ]

    resultText.style.color = '#dc3545'
    resultText.textContent = `오늘 저녁은 [ ${menus[index]} ] 어때요? 🎉`
    isSpinning = false
  }, 4000)
})
