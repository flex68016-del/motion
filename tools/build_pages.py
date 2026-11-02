# -*- coding: utf-8 -*-
"""
SI TU SAVAIS… — Générateur des pages HTML statiques.
Assemble le squelette commun (head, header, footer, scripts) et le contenu
propre à chaque page. Usage : python tools/build_pages.py
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

FAVICON = (
    "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' "
    "viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='5' fill='__COLOR__'/%3E%3C/svg%3E\">"
)

TEMPLATE = """<!DOCTYPE html>
<html lang="fr" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@@TITLE@@</title>
  <meta name="description" content="@@DESC@@">
  @@FAVICON@@
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
  <script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
</head>
<body @@BODYATTRS@@>

  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <canvas id="particles" aria-hidden="true"></canvas>
  <div class="aura" aria-hidden="true"></div>
  <div class="veil" id="veil" aria-hidden="true"></div>

  <header class="site-header">
    <a class="brand" href="index.html" data-nav="@@NAV@@">SI&nbsp;TU&nbsp;<em>SAVAIS</em>…</a>
    <nav class="nav-desktop" aria-label="Navigation principale">
      <ul class="nav-list">
        <li><a class="nav-link" href="index.html" data-nav="home">Accueil</a></li>
        <li><a class="nav-link" href="emotions.html" data-nav="emotions">Émotions</a></li>
        <li><a class="nav-link" href="ecrire.html" data-nav="ecrire">Écrire</a></li>
        <li><a class="nav-link" href="mes-messages.html" data-nav="messages">Mes messages</a></li>
        <li><a class="nav-link" href="a-propos.html" data-nav="about">À propos</a></li>
      </ul>
    </nav>
    <button class="nav-toggle" aria-expanded="false" aria-controls="menu-overlay" aria-label="Ouvrir le menu">
      <span></span><span></span>
    </button>
  </header>
  <div class="menu-overlay" id="menu-overlay">
    <ul class="menu-overlay__list">
      <li><a class="menu-overlay__link" href="index.html" data-nav="home"><span class="num">01</span>Accueil</a></li>
      <li><a class="menu-overlay__link" href="emotions.html" data-nav="emotions"><span class="num">02</span>Émotions</a></li>
      <li><a class="menu-overlay__link" href="ecrire.html" data-nav="ecrire"><span class="num">03</span>Écrire</a></li>
      <li><a class="menu-overlay__link" href="mes-messages.html" data-nav="messages"><span class="num">04</span>Mes messages</a></li>
      <li><a class="menu-overlay__link" href="a-propos.html" data-nav="about"><span class="num">05</span>À propos</a></li>
    </ul>
    <p class="menu-overlay__foot small-caps">Il y a des choses que le cœur ressent.</p>
  </div>

  <main id="contenu">
@@CONTENT@@
  </main>
@@DIALOG@@

  <footer class="site-footer">
    <div class="shell footer-inner">
      <a class="brand" href="index.html">SI&nbsp;TU&nbsp;<em>SAVAIS</em>…</a>
      <nav aria-label="Navigation pied de page">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="emotions.html">Émotions</a></li>
          <li><a href="ecrire.html">Écrire</a></li>
          <li><a href="mes-messages.html">Mes messages</a></li>
          <li><a href="a-propos.html">À propos</a></li>
        </ul>
      </nav>
      <p class="footer-note">Tes mots restent sur cet appareil. Rien n'est envoyé, rien n'est synchronisé.</p>
    </div>
  </footer>
@@SCRIPTS@@
</body>
</html>
"""

SCRIPTS_CORE = """  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/vendor/ScrollTrigger.min.js"></script>
  <script src="assets/vendor/lenis.min.js"></script>
  <script src="js/motion.js"></script>
  <script src="js/particles.js"></script>
  <script src="js/cursor.js"></script>
  <script src="js/store.js"></script>
  <script src="js/app.js"></script>"""

ARROW = "<svg viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M1 11L11 1M11 1H3M11 1V9\" stroke=\"currentColor\" stroke-width=\"1\"/></svg>"
DOWN = "<svg viewBox=\"0 0 12 12\" fill=\"none\"><path d=\"M6 1V11M6 11L1.5 6.5M6 11L10.5 6.5\" stroke=\"currentColor\" stroke-width=\"1\"/></svg>"


def emotion_page(num, key, label, color, phrase, fragments, narration, cta_label,
                 cta_param, prev_label, prev_href, next_label, next_href, reveal_kind, extra_hero=""):
    frags = []
    for i, (txt, side) in enumerate(fragments, start=1):
        right = " fragment--right" if side == "right" else ""
        frags.append(f"""
        <div class="fragment{right}">
          <span class="fragment__num small-caps">0{i}</span>
          <div class="fragment__text"><p class="verse" data-reveal="{reveal_kind}">{txt}</p></div>
        </div>""")
    content = f"""
    <section class="emotion-hero shell" aria-label="{label}">
      <p class="emotion-hero__num small-caps">Émotion 0{num} / 05</p>
{extra_hero}
      <div class="emotion-hero__center">
        <p class="small-caps">{label}</p>
        <h1 class="display-xl emotion-hero__name">
          <span class="hrow"><span class="hrow-in">{label.upper()}</span></span>
        </h1>
        <p class="verse emotion-hero__phrase">« {phrase} »</p>
      </div>
      <p class="emotion-hero__hint" aria-hidden="true">Descendre doucement</p>
    </section>

    <section class="section shell" aria-label="Fragments">
      <div class="eyebrow"><span class="small-caps" data-reveal="fade">Fragments</span></div>
      <div class="fragments">{''.join(frags)}
      </div>
    </section>

    <section class="section shell emotion-narration" aria-label="Narration">
      <p class="narration" data-reveal="lines">{narration}</p>
    </section>

    <section class="section shell emotion-next" aria-label="Écrire et continuer">
      <div class="emotion-next__row">
        <a class="btn btn--primary" href="ecrire.html?emotion={cta_param}">
          <span class="btn-line">{cta_label}</span>
          <span class="btn-orb" aria-hidden="true">{ARROW}</span>
        </a>
        <a class="next-link" href="{next_href}">
          <span class="label">Ensuite</span>
          <span class="target">{next_label}</span>
        </a>
      </div>
      <div class="emotion-next__row hairline-x" style="padding-top:2rem">
        <a class="next-link" href="{prev_href}">
          <span class="label">Avant</span>
          <span class="target">{prev_label}</span>
        </a>
        <a class="btn btn--ghost" href="emotions.html">
          <span class="btn-line">Toutes les émotions</span>
          <span class="btn-orb" aria-hidden="true">{DOWN}</span>
        </a>
      </div>
    </section>"""
    return content


PAGES = {}

# ---------------------------------------------------------------- GRATITUDE
PAGES["emotion-gratitude.html"] = {
    "title": "Gratitude — SI TU SAVAIS…",
    "desc": "Tu as changé quelque chose en moi. L'univers Gratitude de SI TU SAVAIS…",
    "color": "#E4C99B",
    "nav": "emotions",
    "bodyattrs": 'data-page="emotion" data-emotion="gratitude" data-particle-density="21000"',
    "scripts": SCRIPTS_CORE + "\n  <script src=\"js/pages/emotion.js\"></script>",
    "content": emotion_page(
        num=4, key="gratitude", label="Gratitude", color="#E4C99B",
        phrase="Il y a des présences qui changent une vie sans le savoir.",
        fragments=[
            ("Tu étais là. Cela a suffi à changer la suite.", "left"),
            ("Je ne t'ai jamais remercié pour l'évidence.", "right"),
            ("Certaines lumières ne s'éteignent pas.", "left"),
        ],
        narration="La gratitude est la mémoire du cœur. Elle ne réclame rien — elle reconnaît. "
                  "Il y a probablement quelqu'un qui ignore encore <em>ce que sa présence a changé.</em> "
                  "Tu peux lui dire, aujourd'hui.",
        cta_label="Écrire un merci", cta_param="gratitude",
        prev_label="Nostalgie", prev_href="emotion-nostalgie.html",
        next_label="Adieu", next_href="emotion-adieu.html",
        reveal_kind="scale",
        extra_hero="""      <div class="gratitude-light" aria-hidden="true"></div>""",
    ),
}

# ---------------------------------------------------------------- ADIEU
PAGES["emotion-adieu.html"] = {
    "title": "Adieu — SI TU SAVAIS…",
    "desc": "Tout ne peut pas rester. L'univers Adieu de SI TU SAVAIS…",
    "color": "#A49AA5",
    "nav": "emotions",
    "bodyattrs": 'data-page="emotion" data-emotion="adieu" data-particle-density="30000"',
    "scripts": SCRIPTS_CORE + "\n  <script src=\"js/pages/emotion.js\"></script>",
    "content": emotion_page(
        num=5, key="adieu", label="Adieu", color="#A49AA5",
        phrase="Laisser partir n'efface pas ce qui a existé.",
        fragments=[
            ("Je te laisse partir sans te laisser partir de moi.", "left"),
            ("Nous n'étions pas faits pour durer, seulement pour compter.", "right"),
            ("Tout ne peut pas rester — et c'est déjà beaucoup d'avoir été.", "left"),
        ],
        narration="Faire ses adieux, ce n'est pas effacer. C'est déposer doucement ce qu'on ne peut plus "
                  "porter. <em>Ce qui a existé n'a pas besoin de durer pour être vrai.</em> "
                  "Écris la dernière phrase — elle appartient au passé.",
        cta_label="Écrire un adieu", cta_param="adieu",
        prev_label="Gratitude", prev_href="emotion-gratitude.html",
        next_label="Amour", next_href="emotion-amour.html",
        reveal_kind="fade",
        extra_hero="",
    ),
}

# ---------------------------------------------------------------- HUB ÉMOTIONS
HUB_ROWS = [
    ("01", "Amour", "Ce que je n'ai jamais osé te dire.", "emotion-amour.html", "#D6A0AD", "rgba(214,160,173,.09)", "20%"),
    ("02", "Regret", "Si seulement j'avais trouvé les mots.", "emotion-regret.html", "#C4697E", "rgba(168,66,88,.10)", "70%"),
    ("03", "Nostalgie", "Certaines absences ne vieillissent jamais.", "emotion-nostalgie.html", "#B9AECC", "rgba(185,174,204,.09)", "35%"),
    ("04", "Gratitude", "Tu as changé quelque chose en moi.", "emotion-gratitude.html", "#E4C99B", "rgba(228,201,155,.09)", "65%"),
    ("05", "Adieu", "Tout ne peut pas rester.", "emotion-adieu.html", "#A49AA5", "rgba(164,154,165,.08)", "45%"),
]
hub_rows = "".join(f"""
        <a class="emotion-row" href="{href}" style="--row-accent:{accent};--row-tint:{tint};--rx:{rx}" data-reveal="fade" data-reveal-delay="{i * 0.07:.2f}">
          <span class="emotion-row__num">{num}</span>
          <span class="emotion-row__body">
            <span class="emotion-row__name">{name}</span>
            <span class="emotion-row__quote">{quote}</span>
          </span>
          <span class="emotion-row__arrow" aria-hidden="true">{ARROW}</span>
        </a>""" for i, (num, name, quote, href, accent, tint, rx) in enumerate(HUB_ROWS))

PAGES["emotions.html"] = {
    "title": "Les émotions — SI TU SAVAIS…",
    "desc": "Amour, regret, nostalgie, gratitude, adieu : cinq univers pour ce que tu n'as jamais dit.",
    "color": "#D6A0AD",
    "nav": "emotions",
    "bodyattrs": 'data-page="emotions" data-particle-density="26000"',
    "scripts": SCRIPTS_CORE,
    "content": f"""
    <section class="emotions-hub-intro shell" aria-label="Les cinq émotions">
      <div class="eyebrow"><span class="small-caps" data-reveal="fade">Les cinq émotions</span></div>
      <h1 class="display-xl" data-reveal="lines" style="max-width:14ch">Cinq univers pour ce que tu n'as jamais dit.</h1>
      <p class="lead" data-reveal="fade" data-reveal-delay="0.3" style="margin-top:2.5rem">
        Chacun possède sa lumière, son rythme, sa respiration. Choisis celui qui te ressemble aujourd'hui.
      </p>
    </section>

    <section class="section shell" aria-label="Choisir une émotion">
      <div class="emotions-list">{hub_rows}
      </div>
    </section>

    <section class="cta-final shell" aria-label="Écrire">
      <h2 class="verse" data-reveal="words">Ou écris, tout simplement.</h2>
      <div class="btn-row" data-reveal="fade" data-reveal-delay="0.25">
        <a class="btn btn--primary" href="ecrire.html">
          <span class="btn-line">Écrire ce que je ressens</span>
          <span class="btn-orb" aria-hidden="true">{ARROW}</span>
        </a>
      </div>
    </section>""",
}

# ---------------------------------------------------------------- ÉCRIRE
PAGES["ecrire.html"] = {
    "title": "Écrire — SI TU SAVAIS…",
    "desc": "Écris ce que tu n'as jamais pu dire. Un espace intime, local, sans envoi.",
    "color": "#D6A0AD",
    "nav": "ecrire",
    "bodyattrs": 'data-page="ecrire" data-particle-density="32000"',
    "scripts": SCRIPTS_CORE + "\n  <script src=\"js/pages/ecrire.js\"></script>",
    "content": """
    <section class="section shell" style="padding-top:clamp(9rem,20vh,13rem)" aria-label="L'atelier">
      <div class="eyebrow"><span class="small-caps" data-reveal="fade">L'atelier</span></div>
      <h1 class="display-lg" data-reveal="lines" style="max-width:16ch">Écris ce que tu n'as jamais pu dire.</h1>
    </section>

    <section class="section shell" aria-label="Rédaction">
      <div class="editor-grid">
        <form id="editor-form" novalidate>
          <div class="field">
            <label for="f-emotion">Émotion</label>
            <select id="f-emotion" name="emotion" required>
              <option value="amour">Amour — ce que je n'ai jamais osé dire</option>
              <option value="regret">Regret — ce que j'aurais voulu prononcer</option>
              <option value="nostalgie">Nostalgie — ce qui me manque</option>
              <option value="gratitude">Gratitude — le merci oublié</option>
              <option value="adieu">Adieu — ce que je dois laisser partir</option>
            </select>
          </div>

          <div class="field">
            <label for="f-to">Pour <span class="meta">— facultatif</span></label>
            <input type="text" id="f-to" name="to" maxlength="80" autocomplete="off" placeholder="Un prénom, un surnom…">
          </div>

          <div class="field">
            <label for="f-message">Message</label>
            <textarea id="f-message" name="message" maxlength="600" required
              placeholder="Prends ton temps. Personne ne lira sous tes épaules."></textarea>
            <div class="field__hint">
              <p class="field__error" id="f-message-error" role="alert"></p>
              <span class="meta"><span id="f-count">0</span> / 600</span>
            </div>
          </div>

          <div class="field">
            <label for="f-signature">Signature <span class="meta">— facultatif</span></label>
            <input type="text" id="f-signature" name="signature" maxlength="80" autocomplete="off" placeholder="Toi, ou rien">
          </div>

          <button class="btn btn--primary" type="submit" id="f-submit">
            <span class="btn-line">Découvrir mon message</span>
            <span class="btn-orb" aria-hidden="true">""" + ARROW + """</span>
          </button>
        </form>

        <aside class="preview" aria-label="Aperçu du message">
          <div class="preview__stage">
            <p class="small-caps" id="preview-emotion">Amour</p>
            <p class="preview__msg" id="preview-msg"><span class="preview__placeholder">Ton message apparaîtra ici, doucement, pendant que tu écris…</span></p>
            <p class="preview__sign" id="preview-sign"></p>
          </div>
        </aside>
      </div>
    </section>""",
    "dialog": """
    <!-- Scène de révélation (hors de <main> pour couvrir header et footer) -->
    <div class="reveal-scene" id="reveal-scene" role="dialog" aria-modal="true" aria-label="Ton message">
      <div class="reveal-scene__body">
        <p class="small-caps reveal-scene__emotion" id="reveal-emotion">Amour</p>
        <p class="reveal-scene__msg" id="reveal-msg"></p>
        <p class="reveal-scene__meta" id="reveal-meta"></p>
      </div>
      <div class="reveal-scene__actions" id="reveal-actions">
        <button class="btn btn--primary" type="button" data-act="copy">
          <span class="btn-line">Copier</span>
        </button>
        <button class="btn btn--ghost" type="button" data-act="share">
          <span class="btn-line">Partager</span>
        </button>
        <button class="btn btn--ghost" type="button" data-act="save">
          <span class="btn-line">Enregistrer</span>
        </button>
        <button class="btn btn--ghost" type="button" data-act="edit">
          <span class="btn-line">Modifier</span>
        </button>
        <button class="btn btn--ghost" type="button" data-act="restart">
          <span class="btn-line">Recommencer</span>
        </button>
      </div>
    </div>""",
}

# ---------------------------------------------------------------- MES MESSAGES
PAGES["mes-messages.html"] = {
    "title": "Mes messages — SI TU SAVAIS…",
    "desc": "Tes messages confiés à cet espace, conservés localement dans ton navigateur.",
    "color": "#D6A0AD",
    "nav": "messages",
    "bodyattrs": 'data-page="messages" data-particle-density="30000"',
    "scripts": SCRIPTS_CORE + "\n  <script src=\"js/pages/messages.js\"></script>",
    "content": """
    <section class="section shell" style="padding-top:clamp(9rem,20vh,13rem)" aria-label="Mes messages">
      <div class="eyebrow"><span class="small-caps" data-reveal="fade">Confiances</span></div>
      <h1 class="display-lg" data-reveal="lines" style="max-width:14ch">Mes messages.</h1>

      <div class="filters" role="group" aria-label="Filtrer par émotion" data-reveal="fade" data-reveal-delay="0.2">
        <button class="filter-btn" type="button" data-filter="all" aria-pressed="true">Toutes</button>
        <button class="filter-btn" type="button" data-filter="amour" aria-pressed="false">Amour</button>
        <button class="filter-btn" type="button" data-filter="regret" aria-pressed="false">Regret</button>
        <button class="filter-btn" type="button" data-filter="nostalgie" aria-pressed="false">Nostalgie</button>
        <button class="filter-btn" type="button" data-filter="gratitude" aria-pressed="false">Gratitude</button>
        <button class="filter-btn" type="button" data-filter="adieu" aria-pressed="false">Adieu</button>
      </div>

      <div id="messages-list"></div>

      <div class="empty-state" id="empty-state" hidden>
        <span class="empty-state__dot" aria-hidden="true"></span>
        <p class="verse" style="max-width:20ch">« Tu n'as encore rien confié à cet espace. »</p>
        <a class="btn btn--primary" href="ecrire.html">
          <span class="btn-line">Écrire mon premier message</span>
          <span class="btn-orb" aria-hidden="true">""" + ARROW + """</span>
        </a>
      </div>
    </section>""",
    "dialog": """
    <!-- Lecture plein écran (hors de <main> pour couvrir header et footer) -->
    <div class="reveal-scene" id="reader" role="dialog" aria-modal="true" aria-label="Lecture du message">
      <div class="reveal-scene__body">
        <p class="small-caps reveal-scene__emotion" id="reader-emotion"></p>
        <p class="reveal-scene__msg" id="reader-msg"></p>
        <p class="reveal-scene__meta" id="reader-meta"></p>
      </div>
      <div class="reveal-scene__actions" id="reader-actions">
        <a class="btn btn--primary" id="reader-edit" href="ecrire.html">
          <span class="btn-line">Modifier</span>
        </a>
        <button class="btn btn--ghost" type="button" id="reader-delete">
          <span class="btn-line">Supprimer</span>
        </button>
        <button class="btn btn--ghost" type="button" id="reader-close">
          <span class="btn-line">Fermer</span>
        </button>
      </div>
      <p class="field__error" id="reader-confirm" style="position:absolute;bottom:6.5rem;left:0;right:0;text-align:center" role="alert"></p>
    </div>""",
}

# ---------------------------------------------------------------- À PROPOS
PAGES["a-propos.html"] = {
    "title": "À propos — SI TU SAVAIS…",
    "desc": "Pourquoi cet espace existe : certaines paroles méritent simplement d'exister.",
    "color": "#D6A0AD",
    "nav": "about",
    "bodyattrs": 'data-page="about" data-particle-density="28000"',
    "scripts": SCRIPTS_CORE,
    "content": """
    <section class="about-opening shell" aria-label="À propos">
      <div class="eyebrow"><span class="small-caps" data-reveal="fade">À propos</span></div>
      <h1 class="display-xl" data-reveal="lines">Nous passons une partie de notre vie à chercher les bons mots.</h1>
      <h2 class="display-xl" style="color:var(--color-muted);font-size:clamp(1.9rem,5vw,4.2rem);margin-top:1.2rem" data-reveal="lines" data-reveal-delay="0.35">
        Et une autre à regretter de ne pas les avoir trouvés.
      </h2>
    </section>

    <section class="section shell" aria-label="Le concept">
      <div class="about-body">
        <p data-reveal="fade"><strong>SI TU SAVAIS…</strong> est né d'une conviction simple : les mots les plus importants sont souvent ceux qui restent au bord des lèvres. Ce site n'est pas un réseau social. Rien n'est publié, rien n'est envoyé, rien n'est synchronisé.</p>
        <p data-reveal="fade">C'est un espace pour poser une phrase trop lourde, un merci trop tardif, un adieu jamais dit. Le geste d'écrire suffit parfois à libérer ce que la voix n'a pas su porter.</p>
        <p data-reveal="fade">Cinq univers — l'amour, le regret, la nostalgie, la gratitude, l'adieu — composent la géographie de ce qui nous traverse. Chacun a sa lumière, son rythme, sa respiration.</p>
        <p data-reveal="fade" class="meta">Tes messages sont conservés uniquement dans le stockage local de ton navigateur. Tu peux les relire, les modifier, les copier, les partager — ou les supprimer. Ils t'appartiennent.</p>
      </div>
    </section>

    <section class="about-close shell" aria-label="Conclusion">
      <p class="verse" data-reveal="words" style="font-size:clamp(1.8rem,4.5vw,3.6rem)">Certaines paroles méritent simplement d'exister.</p>
      <div class="btn-row" data-reveal="fade" data-reveal-delay="0.3" style="justify-content:center;margin-top:3rem">
        <a class="btn btn--primary" href="ecrire.html">
          <span class="btn-line">Écrire, maintenant</span>
          <span class="btn-orb" aria-hidden="true">""" + ARROW + """</span>
        </a>
      </div>
    </section>""",
}


def build():
    for name, cfg in PAGES.items():
        html = (TEMPLATE
                .replace("@@TITLE@@", cfg["title"])
                .replace("@@DESC@@", cfg["desc"])
                .replace("@@FAVICON@@", FAVICON.replace("__COLOR__", cfg["color"]))
                .replace("@@BODYATTRS@@", cfg["bodyattrs"])
                .replace("@@NAV@@", cfg["nav"])
                .replace("@@CONTENT@@", cfg["content"])
                .replace("@@DIALOG@@", cfg.get("dialog", ""))
                .replace("@@SCRIPTS@@", cfg["scripts"]))
        path = ROOT / name
        path.write_text(html, encoding="utf-8", newline="\n")
        print("écrit :", name, f"({len(html)} octets)")


if __name__ == "__main__":
    build()
