export default function Profile() {
  return (
    <section id="profilis">
      <p className="eyebrow"><span className="jp">プロフィール</span> · Profilis</p>
      <h2 className="display">Kas <mark>aš?</mark></h2>
      <div className="profile-grid">
        <div className="panel">
          <p>
            Sveiki! Aš — <strong>Inesyz_0</strong>. Didžiąją laisvalaikio dalį praleidžiu
            trijuose pasauliuose: anime serialuose, piešinių eskizuose ir žaidimų
            serveriuose su draugais.
          </p>
          <p>
            Ši svetainė — bandymas visus tuos pasaulius sudėti į vieną vietą. Čia rasi mano
            mėgstamiausius anime (įspėju: skonis linksta į tamsiąją pusę 🌙), žaidimus, prie
            kurių prarandu laiko nuovoką, ir kampelį, kuriame netrukus apsigyvens mano
            piešiniai.
          </p>
          <p>Jei skaitydamas(-a) pagalvojai „o, čia ir aš toks(-ia)!" — mes tikriausiai sutartume.</p>
        </div>
        <div className="panel char-card">
          <h3 className="display">Veikėjo kortelė</h3>
          <span className="jp-sub jp">キャラクターシート</span>
          <dl style={{ margin: 0 }}>
            <div className="char-row"><dt>Slapyvardis</dt><dd className="mono">Inesyz_0</dd></div>
            <div className="char-row"><dt>Klasė</dt><dd>Otaku × Artist × Gamer</dd></div>
            <div className="char-row"><dt>Mėgstamas žanras</dt><dd>Tamsi fantastika, trileriai</dd></div>
            <div className="char-row"><dt>Dažniausiai rasi</dt><dd>osu! lobby arba prie eskizų</dd></div>
            <div className="char-row"><dt>Statusas</dt><dd><span className="status-dot">●</span> Online</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}
