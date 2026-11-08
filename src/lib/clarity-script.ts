/** The project owner's manual Clarity tag, loaded only after analytics consent. */
export const clarityScript = `
(function(){
  var started=false;
  function consent(allowed){
    if(allowed&&!started){
      started=true;
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "zafnkpkl6f");
    }
    if(window.clarity) window.clarity('consentv2',{
      ad_Storage:'denied',analytics_Storage:allowed?'granted':'denied'
    });
  }
  window.addEventListener('wedhq-analytics-consent',function(e){consent(e.detail===true)});
  try{if(localStorage.getItem('wedhq-analytics-consent')==='granted')consent(true)}catch(e){}
})();`;
