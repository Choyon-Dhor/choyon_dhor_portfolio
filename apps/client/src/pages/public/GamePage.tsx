import { DataHighwayGame } from '../../components/DataHighwayGame';
import { GlassCard } from '../../components/GlassCard';
import { useSite } from '../../context/SiteContext';

function asText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function GamePage() {
  const { settings, byType } = useSite();
  const gameConfig = settings.gameConfig;
  const featuredResearch = byType('research').find((item) => item.featured) ?? byType('research')[0];
  const featuredProject = byType('project').find((item) => item.featured) ?? byType('project')[0];
  const featuredLeadership = byType('experience').find((item) => item.featured) ?? byType('experience')[0];
  const featuredActivity = byType('activity').find((item) => item.featured) ?? byType('activity')[0];
  const featuredPublication = byType('publication').find((item) => item.featured) ?? byType('publication')[0];
  const featuredEvent = byType('event').find((item) => item.featured) ?? byType('event')[0];
  const featuredAchievement = byType('achievement').find((item) => item.featured) ?? byType('achievement')[0];
  const featuredEducation = byType('education')[0];
  const featuredLog = byType('blog').find((item) => item.featured) ?? byType('blog')[0];
  const primaryStat = settings.stats[0];

  const fallbackChapters = [
    { title: 'Academic Core', description: 'Secure your academic and research proof points before the route destabilizes.' },
    { title: 'Systems Corridor', description: 'Push through project, publication and product evidence while dodging anomalies.' },
    { title: 'Impact Network', description: 'Finish strong by locking in leadership, event and community contributions.' }
  ];

  const chapters = gameConfig.chapters.filter((chapter) => chapter.enabled).sort((left, right) => left.order - right.order).map((chapter) => ({
    title: chapter.title,
    description: chapter.description || chapter.backgroundLabel || 'Progress deeper into the route and secure the next verified portfolio sector.'
  }));
  const stageChapters = chapters.length ? chapters : fallbackChapters;

  const missionLines = gameConfig.missions.length ? gameConfig.missions : [
    'Capture every verified signal in the active sector.',
    'Avoid anomaly blocks so integrity does not collapse.',
    'Use shield, repair and overdrive boosts to extend the run.',
    'Reach the extraction gate after the sector is fully mapped.'
  ];
  const obstacleLines = gameConfig.obstacles.length ? gameConfig.obstacles : ['Noise Spike', 'Drift Wall', 'Jammer Pulse'];
  const rewardLines = gameConfig.rewards.length ? gameConfig.rewards : ['Shield Cell', 'Integrity Repair', 'Overdrive Cache'];

  const collectibles = [
    { label: 'Academic Star', fact: primaryStat ? `${String(primaryStat.label)} discovered: ${String(primaryStat.value)}` : 'Academic milestone discovered.', chapter: 'Academic' },
    { label: 'Research Core', fact: featuredResearch ? `Research milestone discovered: ${featuredResearch.title}` : 'Research milestone discovered.', chapter: 'Research' },
    { label: 'Project Chip', fact: featuredProject ? `Project system discovered: ${featuredProject.title}` : 'Project system discovered.', chapter: 'Projects' },
    { label: 'Publication File', fact: featuredPublication ? `Research output discovered: ${featuredPublication.title}` : 'Research output discovered.', chapter: 'Publications' },
    { label: 'Impact Badge', fact: featuredLeadership ? `Leadership milestone discovered: ${featuredLeadership.title}` : 'Leadership milestone discovered.', chapter: 'Leadership' },
    { label: 'Event Beacon', fact: featuredEvent ? `Flagship event discovered: ${featuredEvent.title}` : 'Flagship event discovered.', chapter: 'Events' },
    { label: 'Activity Ticket', fact: featuredActivity ? `Community activity discovered: ${featuredActivity.title}` : 'Community activity discovered.', chapter: 'Activities' },
    { label: 'Achievement Seal', fact: featuredAchievement ? `Achievement discovered: ${featuredAchievement.title}` : 'Achievement discovered.', chapter: 'Achievements' },
    { label: 'Knowledge Cache', fact: featuredLog ? `Research log discovered: ${featuredLog.title}` : 'Research log discovered.', chapter: 'Logs' },
    { label: 'Degree Node', fact: featuredEducation ? `Academic foundation discovered: ${featuredEducation.title}` : 'Academic foundation discovered.', chapter: 'Education' }
  ];

  const routeTitle = gameConfig.title || 'Data Highway';
  const routeDescription = gameConfig.description || 'Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content.';
  const routeDifficulty = asText(gameConfig.difficulty, 'normal');
  const routeVehicle = gameConfig.vehicleLabel || 'Nexus Runner';

  return <section className="game-page container">
    <header className="page-header game-header">
      <div className="eyebrow">ARCADE MODULE</div>
      <h1>{routeTitle}</h1>
      <p className="page-intro">{routeDescription}</p>
    </header>

    <div className="game-layout">
      <DataHighwayGame
        collectibles={collectibles}
        chapters={stageChapters}
        missions={missionLines}
        obstacleLabels={obstacleLines}
        rewardLabels={rewardLines}
        vehicleLabel={routeVehicle}
        baseSpeed={gameConfig.speed || 4}
        difficulty={routeDifficulty === 'easy' || routeDifficulty === 'hard' ? routeDifficulty : 'normal'}
        mobileSimplifiedMode={gameConfig.mobileSimplifiedMode}
      />

      <GlassCard className="game-brief">
        <span className="eyebrow">MISSION BRIEF</span>
        <h2>Longer, richer arcade run</h2>
        <p>This route now behaves more like a survival-arcade mission: multiple sectors, anomaly hazards, recovery pickups, combo scoring and extraction gates that extend the session length.</p>

        <div className="game-brief__section">
          <strong>Mission queue</strong>
          <ol className="game-brief__list">
            {missionLines.map((mission) => <li key={mission}>{mission}</li>)}
          </ol>
        </div>

        <div className="game-brief__section">
          <strong>Sector map</strong>
          <div className="game-brief__chapter-list">
            {stageChapters.map((chapter) => <div className="game-brief__chapter" key={chapter.title}><b>{chapter.title}</b><p>{chapter.description}</p></div>)}
          </div>
        </div>

        <div className="game-brief__section">
          <strong>Route hazards</strong>
          <div className="game-reward-list">
            {obstacleLines.map((obstacle) => <span key={obstacle}>{obstacle}</span>)}
          </div>
        </div>

        <div className="game-brief__section">
          <strong>Support systems</strong>
          <div className="game-reward-list">
            {rewardLines.map((reward) => <span key={reward}>{reward}</span>)}
          </div>
        </div>

        <div className="system-note">Vehicle: {routeVehicle} • Difficulty: {routeDifficulty.toUpperCase()} • Signals on route: {collectibles.length}</div>
      </GlassCard>
    </div>
  </section>;
}
