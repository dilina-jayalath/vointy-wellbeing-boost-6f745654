## Tavoite
Rakennetaan mobiiliapin koko sisältö samanlaisena web-palveluna tähän projektiin `/app`-reitin alle, ja tehdään siitä lopuksi asennettava PWA.

## Mitä Flutter-koodista löytyi
Näkymät: Home, Activities, Challenges, Community, Settings, Profile, Onboarding.
Datamallit: activity, user_challenge, hr_challenges, open hr challenges, challenge_users, community_feed, comment, like/dislike, performed_exercise, wellbeing_index, wellbeing_survey, home_survey, survey_submission, subscription, profile_picture.
Backend tällä hetkellä: `api.vointy.io/api/v1/` + Firebase (auth, push).

## Vaihe 1 — Tietokanta Lovable Cloudiin
Taulut Flutter-mallien mukaan:
- `activities`, `performed_exercises`
- `challenges` (yritys/HR + avoimet), `user_challenges`, `challenge_participants`
- `community_posts`, `post_comments`, `post_likes`
- `wellbeing_surveys`, `survey_questions`, `survey_answers`, `wellbeing_index_scores`
- `teams`, `team_members` (liittyy jo olemassa oleviin `profiles`-tauluun)
RLS: käyttäjä näkee vain oman datansa + oman yrityksen tiimidatan; HR-roolilla laajempi näkyvyys. GRANTit jokaiselle taululle.

## Vaihe 2 — Web-app `/app`-reitin alle
Mobiilinäkymä (max-leveys, alanavigaatio) kirjautuneille käyttäjille:
- **Home** — tervehdys, wellbeing index -kortti, päivän tehtävät, aktiiviset haasteet, avoimet kutsut, kysely-kortti
- **Activities** — aktiviteettilista, suoritusten kirjaus, suoritushistoria
- **Challenges** — omat/yrityksen/avoimet haasteet, liittyminen, edistyminen, tulostaulu
- **Community** — feed, uusi postaus, tykkäykset, kommentit
- **Wellbeing Index** — kyselyn täyttö ja henkilökohtainen indeksi + trendi
- **Profile / Settings** — profiilikuva, kieli, ilmoitukset, tilaus

Kaikki tekstit i18n-järjestelmään (9 kieltä, jo olemassa).

## Vaihe 3 — Employer panel kytketään oikeaan dataan
Nykyiset placeholderit (Wellbeing Index, Surveys, Challenges, Teams, Activate/Invite Users) luetaan samoista tauluista mock-datan sijaan.

## Vaihe 4 — Datansiirto
Kun saat exportin `api.vointy.io`:sta (JSON/CSV), ladataan käyttäjät, haasteet, aktiviteetit ja kyselyvastaukset tauluihin. Salasanoja ei voi siirtää — käyttäjille pakotettu salasanan resetointi ensikirjautumisella.

## Vaihe 5 — PWA
Manifest + ikonit + theme color → asennettavissa kotinäytölle iOS/Android. Offline-tuki vain jos erikseen haluat.

## Tekninen huomio
Rakennetaan Lovable Cloudin päälle, ei `api.vointy.io`:ta vasten — muuten olisitte kiinni vanhassa backendissä. Vanha API voi pyöriä rinnalla kunnes natiiviapit poistetaan käytöstä.

## Ehdotettu järjestys
1. Tietokantaskeema (Vaihe 1)
2. `/app` runko + Home + Wellbeing Index
3. Challenges + Activities
4. Community
5. Profile/Settings + Employer panelin kytkentä
6. Datansiirto + PWA

Aloitetaanko vaiheesta 1 ja 2?
