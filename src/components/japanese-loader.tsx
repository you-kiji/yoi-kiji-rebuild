export function JapaneseLoader() {
  return (
    <div className="yk-loader" role="status" aria-live="polite" aria-label="Loading YOI KIJI">
      <div className="yk-loader__pattern" aria-hidden="true" />
      <div className="yk-loader__content">
        <div className="yk-loader__enso" aria-hidden="true"><span /></div>
        <div className="wordmark yk-loader__wordmark">
          <span className="wordmark-main">YOI KIJI</span>
          <span className="wordmark-sub">THE ART OF TEXTILE LIVING</span>
        </div>
        <p className="yk-loader__japanese" lang="ja">暮らしに、心地よさを。</p>
        <span className="yk-loader__rule" aria-hidden="true"><i /></span>
      </div>
    </div>
  );
}
