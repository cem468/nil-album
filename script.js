(function () {
  'use strict'

  // Lucide simgeleri (ISC lisansı)
  var ICONS = {
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  }

  function icon(name, size) {
    size = size || 24
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>'
  }

  function logo(light, compact) {
    return '<span class="brand' + (light ? ' brand--light' : '') + '" aria-label="Nil Albüm">' +
      '<svg class="brand__mark" viewBox="0 0 48 56" fill="none" aria-hidden="true">' +
      '<path d="M7 47V22C7 11 14 5 24 5s17 6 17 17v25" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M12 43V22c0-8 5-12 12-12s12 4 12 12v21" stroke="currentColor" stroke-width="0.8" opacity=".55"/>' +
      '<path d="M15 37V18l18 20V18" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>' +
      '<path d="M9 48c6-3 11-3 15 0 4-3 9-3 15 0" stroke="currentColor" stroke-width="1.2"/>' +
      '</svg>' +
      (compact ? '' : '<span class="brand__type"><strong>NİL</strong><span>ALBÜM</span></span>') +
      '</span>'
  }

  var $ = function (sel) { return document.querySelector(sel) }
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)) }

  $$('[data-icon]').forEach(function (el) {
    el.outerHTML = icon(el.getAttribute('data-icon'), Number(el.getAttribute('data-size')) || 24)
  })
  $$('[data-logo]').forEach(function (el) {
    var v = el.getAttribute('data-logo')
    el.outerHTML = logo(v.indexOf('light') === 0, v.indexOf('compact') > -1)
  })
  $('#year').textContent = new Date().getFullYear()

  // ---------- Veriler ----------
  var spreads = [
    { left: 'images/veil-closeup.webp', right: 'images/editorial-couple.webp', chapter: 'I. Yakınlık', note: 'Bakışların anlattığı hikâye' },
    { left: 'images/silhouette-couple.webp', right: 'images/mountain-couple.webp', chapter: 'II. Sonsuzluk', note: 'Işığın içinde, iki kişilik bir dünya' },
    { left: 'images/forest-couple.webp', right: 'images/garden-couple.webp', chapter: 'III. Yolculuk', note: 'Aynı yolda, el ele' },
  ]

  var collections = [
    {
      title: 'Léger', subtitle: 'İnce, zamansız, dokulu', image: 'images/album-stack.webp',
      description: 'Sade kapak tasarımı, keten dokusu ve fotoğrafın önüne geçmeyen editorial sayfa düzeni.',
      details: ['Keten kapak', 'Lay-flat baskı', 'Kişiye özel kabartma'],
    },
    {
      title: 'Nocturne', subtitle: 'Sinematik ve etkileyici', image: 'images/hero-rain.webp',
      description: 'Güçlü kontrastlar ve akışkan geçişlerle düğün gününüzü bir kısa film ritminde anlatan dijital deneyim.',
      details: ['Sinematik geçişler', 'Müzik senkronizasyonu', 'Mobil özel görünüm'],
    },
    {
      title: 'Héritage', subtitle: 'Nesilden nesile', image: 'images/album-table.webp',
      description: 'Geniş açılımlı sayfalar, zamana dayanıklı malzemeler ve aile arşivinize yakışan klasik bir sunum.',
      details: ['Sert kapak', 'Arşivsel kağıt', 'Özel saklama kutusu'],
    },
  ]

  // ---------- Header & mobil menü ----------
  var header = $('#siteHeader')
  var menu = $('#mobileMenu')
  var menuBtn = $('#menuOpen')
  var menuOpen = false
  var modalOpen = false

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40) }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  function lockScroll() {
    var locked = menuOpen || modalOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    if (lenis) locked ? lenis.stop() : lenis.start()
  }

  function setMenu(open) {
    menuOpen = open
    menu.classList.toggle('is-open', open)
    menu.setAttribute('aria-hidden', String(!open))
    menuBtn.setAttribute('aria-expanded', String(open))
    lockScroll()
  }
  menuBtn.addEventListener('click', function () { setMenu(true) })
  $('#menuClose').addEventListener('click', function () { setMenu(false) })
  $$('#mobileMenu nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false) }) })

  // ---------- Albüm ----------
  var spread = 0
  var turning = false
  var autoplay = false
  var timer = null
  var spreadEl = $('#albumSpread')
  var progress = $('#albumProgress')
  var prevBtn = $('#spreadPrev')
  var nextBtn = $('#spreadNext')
  var autoBtn = $('#autoplay')
  var pad = function (n) { return (n < 10 ? '0' : '') + n }

  spreads.forEach(function (s, i) {
    var b = document.createElement('button')
    b.setAttribute('aria-label', (i + 1) + '. sayfaya git')
    b.addEventListener('click', function () { goToSpread(i) })
    progress.appendChild(b)
    // görselleri önceden yükle
    new Image().src = s.left
    new Image().src = s.right
  })

  function renderSpread() {
    var s = spreads[spread]
    $('#spreadLeft').src = s.left
    $('#spreadLeft').alt = s.chapter + ' albüm sayfası'
    $('#spreadRight').src = s.right
    $('#spreadRight').alt = s.note
    $('#spreadChapter').textContent = s.chapter
    $('#spreadNote').textContent = s.note
    $('#albumCount').textContent = pad(spread + 1) + ' / ' + pad(spreads.length)
    Array.prototype.forEach.call(progress.children, function (b, i) {
      b.classList.toggle('is-active', i === spread)
      if (i === spread) b.setAttribute('aria-current', 'page')
      else b.removeAttribute('aria-current')
    })
  }

  function setTurning(v) {
    turning = v
    spreadEl.classList.toggle('is-turning', v)
    prevBtn.disabled = v
    nextBtn.disabled = v
  }

  function goToSpread(next) {
    if (turning || next === spread) return
    setTurning(true)
    setTimeout(function () {
      spread = (next + spreads.length) % spreads.length
      renderSpread()
    }, 220)
    setTimeout(function () { setTurning(false) }, 520)
  }

  function renderAutoplay() {
    autoBtn.classList.toggle('is-active', autoplay)
    autoBtn.setAttribute('aria-label', autoplay ? 'Otomatik oynatmayı durdur' : 'Albümü otomatik oynat')
    autoBtn.innerHTML = icon(autoplay ? 'pause' : 'play', 16) + (autoplay ? 'Duraklat' : 'Oynat')
  }

  function restartTimer() {
    clearInterval(timer)
    if (autoplay) timer = setInterval(function () { goToSpread(spread + 1) }, 4200)
  }

  prevBtn.addEventListener('click', function () { goToSpread(spread - 1); restartTimer() })
  nextBtn.addEventListener('click', function () { goToSpread(spread + 1); restartTimer() })
  autoBtn.addEventListener('click', function () { autoplay = !autoplay; renderAutoplay(); restartTimer() })

  // dokunmatik kaydırma ile sayfa çevirme
  var touchX = null
  spreadEl.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX }, { passive: true })
  spreadEl.addEventListener('touchend', function (e) {
    if (touchX === null) return
    var dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) goToSpread(spread + (dx < 0 ? 1 : -1))
    touchX = null
  })

  renderSpread()
  renderAutoplay()

  // ---------- Koleksiyonlar & modal ----------
  var list = $('#collectionList')
  var backdrop = $('#modalBackdrop')
  var dialog = $('#collectionModal')
  var lastFocus = null

  collections.forEach(function (item, index) {
    var b = document.createElement('button')
    b.className = 'collection'
    b.setAttribute('data-reveal', '')
    b.setAttribute('aria-label', item.title + ' koleksiyonunu incele')
    b.innerHTML =
      '<span class="collection__index">' + pad(index + 1) + '</span>' +
      '<span class="collection__image"><img src="' + item.image + '" alt="" data-parallax loading="lazy" /></span>' +
      '<span class="collection__copy"><strong>' + item.title + '</strong><small>' + item.subtitle + '</small></span>' +
      '<span class="collection__arrow">' + icon('arrow-right') + '</span>'
    b.addEventListener('click', function () { openModal(item) })
    list.appendChild(b)
  })

  var selected = null
  function openModal(item) {
    selected = item
    lastFocus = document.activeElement
    $('#modalImage').src = item.image
    $('#modalImage').alt = item.title + ' koleksiyonu'
    $('#modal-title').textContent = item.title
    $('#modalSubtitle').textContent = item.subtitle
    $('#modalDescription').textContent = item.description
    $('#modalDetails').innerHTML = item.details.map(function (d) { return '<li>' + icon('check', 16) + d + '</li>' }).join('')
    backdrop.hidden = false
    modalOpen = true
    lockScroll()
    setTimeout(function () { $('#modalClose').focus() }, 30)
  }

  function closeModal() {
    if (!modalOpen) return
    backdrop.hidden = true
    modalOpen = false
    lockScroll()
    if (lastFocus) lastFocus.focus()
  }

  $('#modalClose').addEventListener('click', closeModal)
  backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) closeModal() })
  $('#modalCta').addEventListener('click', function () {
    var select = $('#collectionSelect')
    if (selected) select.value = selected.title
    lastFocus = null
    closeModal()
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeModal() }
    if (modalOpen && e.key === 'Tab') {
      var focusable = dialog.querySelectorAll('button, a, input, select, textarea, [tabindex="0"]')
      if (!focusable.length) return
      var first = focusable[0]
      var last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    if (!modalOpen && !menuOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      var rect = spreadEl.getBoundingClientRect()
      var visible = rect.top < window.innerHeight && rect.bottom > 0
      if (visible && e.key === 'ArrowRight') goToSpread(spread + 1)
      if (visible && e.key === 'ArrowLeft') goToSpread(spread - 1)
    }
  })

  // ---------- Ön görüşme özeti ----------
  var summaryBox = $('#summary')
  var summaryText = ''
  var copyBtn = $('#summaryCopy')

  function renderCopy(copied) {
    copyBtn.innerHTML = icon(copied ? 'check' : 'copy', 16) + (copied ? 'Kopyalandı' : 'Özeti kopyala')
  }

  function formatDate(value) {
    if (!value) return 'Henüz belirlenmedi'
    var p = value.split('-')
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : value
  }

  $('#quoteForm').addEventListener('submit', function (e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    summaryText = [
      'NİL ALBÜM — ÖN GÖRÜŞME ÖZETİ',
      'Çift: ' + data.get('couple'),
      'Düğün tarihi: ' + formatDate(data.get('date')),
      'İlgilenilen koleksiyon: ' + data.get('collection'),
      'Şehir: ' + data.get('city'),
      'Not: ' + (data.get('note') || '—'),
    ].join('\n')
    $('#summaryText').textContent = summaryText
    renderCopy(false)
    summaryBox.hidden = false
    summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })

  copyBtn.addEventListener('click', function () {
    function fallback() {
      var area = document.createElement('textarea')
      area.value = summaryText
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(summaryText).catch(fallback)
    } else {
      fallback()
    }
    renderCopy(true)
  })
  $('#summaryClose').addEventListener('click', function () { summaryBox.hidden = true })

  // ---------- Animasyonlar (GSAP + Lenis, varsa) ----------
  var lenis = null
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !window.gsap) return

  var gsap = window.gsap
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger)

  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true })
    if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update)
    gsap.ticker.add(function (time) { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    // çapa bağlantılarını Lenis ile yumuşak kaydır
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href')
        var target = id === '#top' ? 0 : document.querySelector(id)
        if (target === null) return
        e.preventDefault()
        lenis.scrollTo(target, { offset: id === '#top' ? 0 : -80 })
      })
    })
  }

  gsap.from('.hero__line > span', { yPercent: 110, duration: 1.15, stagger: 0.1, ease: 'power4.out' })
  gsap.from('.hero__intro, .hero__actions', { opacity: 0, y: 18, duration: 0.8, delay: 0.55, stagger: 0.12, ease: 'power2.out' })
  gsap.from('.hero-photo--main', { opacity: 0, y: -70, rotate: 5, duration: 1.15, delay: 0.35, ease: 'power3.out' })
  gsap.from('.hero-photo--small', { opacity: 0, y: -45, rotate: -8, duration: 1, delay: 0.65, ease: 'power3.out' })
  gsap.from('.hero-seal', { opacity: 0, scale: 0.85, duration: 0.8, delay: 0.9, ease: 'back.out(1.5)' })

  if (!window.ScrollTrigger) return

  $$('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      opacity: 0, y: 38, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    })
  })
  $$('[data-parallax]').forEach(function (el) {
    gsap.to(el, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  })
  gsap.to('.manifesto__image img', {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  })
})()
