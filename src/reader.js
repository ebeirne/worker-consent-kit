// Reply reader: decides what a short text reply to "Can you work X? Reply YES or NO" means.
// Labels: yes, no, conditional, unclear. `sure` is true only when a yes is safe to record without a confirm step.
(function (root) {
  var YESPH = /\b(no problem|no prob|np|no worries|not a problem|no hay problema|sin problema|no problemo)\b/g;
  var NOTSURE = /\b(not sure|no se|no estoy segur[oa]|idk|i dont know|dunno|no idea)\b/;
  var COND = /\b(but|pero|only|solo|until|till|til|hasta|after|despues|if|unless|a menos|late|tarde|early|temprano|leave at|salir a|come at|come in at|llego|llegar|get there|in an hour|en una hora|not close|no puedo cerrar|instead|mejor)\b|\bsi me\b|\ba las \d|\b\d{1,2}(:\d{2})?\s*(am|pm)?\b/;
  var QUESTION = /\?\s*$|\b(who is this|whos this|who this|quien es|quien eres|what time|a que hora|how much|cuanto|which store|what store|que tienda|wrong number|numero equivocado|call me|llamame|is this about|es para)\b/;
  var HEDGE = /\b(maybe|tal vez|quizas?|probably|prob|i might|might|i think|creo que|let me (check|see|ask)|lemme (check|see)|dejame (ver|preguntar|checar)|ill let you know|te aviso|i guess|depends|depende|ask (him|her|them|[a-z]+)|preguntale)\b/;
  var NO = /\b(no|nope|nah|naw|no+o|cant|cannot|can not|wont|not today|not tonight|not this time|busy|im off|pass|no puedo|no voy|no gracias|imposible|ocupad[oa]|sorry|lo siento|sick|enferm[oa]|class|clase|school|escuela|other job|otro trabajo|noemoji)\b/;
  var STRONG = ['yes', 'yeah', 'yea', 'yep', 'yup', 'sure', 'ok', 'okay', 'okey', 'k', 'kk', 'bet', 'omw', 'si', 'sip', 'claro', 'dale', 'va', 'vale', 'okis', 'voy', 'puedo', 'yesemoji', 'yesphrase', 'coming', 'absolutely', 'course', 'yessir', 'can', 'alright', 'aight', 'ight', 'gotchu', 'gotcha', 'definitely', 'simon', 'seguro', 'yas', 'yess', 'yesss'];
  var STRONGPH = /\b(be there|on my way|count me in|got it|got you|say less|i can|de una)\b/;
  var OK = new Set(STRONG.concat(['i', 'ill', 'come', 'do', 'it', 'got', 'you', 'u', 'count', 'me', 'in', 'be', 'there', 'of', 'thing', 'sir', 'maam', 'on', 'my', 'way', 'say', 'less', 'que', 'work', 'see', 'ya', 'ahi', 'will', 'de', 'una', 'today', 'tonight', 'hoy', 'now', 'ahora', 'shift', 'turno', 'the', 'el', 'that', 'for', 'te', 'lo', 'please', 'pls', 'thanks', 'thx', 'gracias', 'boss', 'jefe', 'jefa', 'bro', 'lol', 'haha', 'cool', 'totally', 'and', 'y', 'ma']));
  function norm(s) {
    s = String(s || '').replace(/[‘’']/g, '').replace(/[👍👌✅🙋💯🫡]/gu, ' yesemoji ').replace(/[👎❌]/gu, ' noemoji ').replace(/❓/gu, '?');
    s = s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return s.replace(/[^a-z0-9?:\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function read(text) {
    var s = norm(text);
    if (!s) return { label: 'unclear', sure: false, why: 'Empty reply' };
    s = s.replace(YESPH, 'yesphrase');
    s = s.replace(/\bno (puedo|voy a poder|voy)\b/g, 'noemoji');
    if (NOTSURE.test(s)) return { label: 'unclear', sure: false, why: 'Says they are not sure' };
    var toks = s.replace(/\?/g, ' ').split(' ').filter(Boolean);
    var hasYes = toks.some(function (t) { return STRONG.indexOf(t) >= 0; }) || STRONGPH.test(s);
    if (COND.test(s)) return { label: 'conditional', sure: false, why: hasYes ? 'Yes, with a change (time, limit or condition)' : 'Offers something different from the shift asked' };
    if (QUESTION.test(s)) return { label: 'unclear', sure: false, why: 'Asks a question' };
    if (HEDGE.test(s)) return { label: 'unclear', sure: false, why: 'Hedges (maybe, let me check)' };
    var hasNo = NO.test(s);
    if (hasNo && hasYes) return { label: 'unclear', sure: false, why: 'Says yes and no' };
    if (hasNo) return { label: 'no', sure: true, why: 'Says no' };
    if (hasYes) {
      var clean = toks.every(function (t) { return OK.has(t); });
      return clean ? { label: 'yes', sure: true, why: 'Plain yes' } : { label: 'yes', sure: false, why: 'Sounds like yes, with other words: confirm first' };
    }
    return { label: 'unclear', sure: false, why: 'No yes or no found' };
  }
  root.readReply = read;
  if (typeof module !== 'undefined') module.exports = { read: read, norm: norm };
})(typeof window !== 'undefined' ? window : globalThis);
