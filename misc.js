document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.star-rating').forEach(initStarRating);
});

function initStarRating(wrapper){
  const stars  = [...wrapper.querySelectorAll('.star')];
  const valueInput = wrapper.querySelector('input[name="Bewertung"]');
  const form   = wrapper.closest('form');
  let current  = +valueInput.value || 0;

  /* 1 | Visuelle + ARIA-Initialisierung */
  wrapper.setAttribute('role','radiogroup');
  stars.forEach((star,i)=>{
    const val=i+1;
    star.setAttribute('role','radio');
    star.setAttribute('aria-checked','false');

    star.addEventListener('mouseenter', ()=>paint(val));
    star.addEventListener('mouseleave', ()=>paint(current));

    const choose = ()=>{
      current = val;
      valueInput.value = current;   // ❶ an Form übergeben
      paint(current);
		  /* Modal-Wrapper nach erfolgreicher Submission verstecken */
		  const modal = document.getElementById("star-rating-modal-wrapper");
		  if(modal) modal.classList.add('display-none');
      /* ❷ sofort absenden – bevorzugt modernes requestSubmit() */
      if(form.requestSubmit){ form.requestSubmit(); }
      else                  { form.submit();       }
    };
    star.addEventListener('click',  choose);
    star.addEventListener('keyup',e=>{
      if(e.key==='Enter'||e.key===' ') choose();
    });
  });
  paint(current);
  
  function paint(r){
    stars.forEach((s,idx)=>{
      const filled = idx < r;
      s.classList.toggle('filled',filled);
      s.setAttribute('aria-checked',filled);
    });
  }
}
