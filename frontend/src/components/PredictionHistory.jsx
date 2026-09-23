function PredictionHistory({ history }) {
  return (
    <section className="history-section">

      <div className="history-heading">
        <h2>Prediction History</h2>

        <p>
          Your previous obesity category predictions.
        </p>
      </div>

      {history.length === 0 ? (
        <p className="history-status">
          No predictions have been saved yet.
        </p>
      ) : (
        <div className="history-list">

          {history.map((item) => {

            const date = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleString()
              : "Date unavailable";

            const formattedPrediction =
              item.prediction?.replaceAll("_", " ");

            return (
              <div
                className="history-card"
                key={item.id}
              >

                <div className="history-card-main">

                  <span className="history-date">
                    {date}
                  </span>

                  <h3>
                    {formattedPrediction}
                  </h3>

                </div>

                <div className="history-card-details">

                  <div className="history-detail">
                    <span>Height</span>
                    <strong>
                      {item.inputData?.Height}
                    </strong>
                  </div>

                  <div className="history-detail">
                    <span>Weight</span>
                    <strong>
                      {item.inputData?.Weight}
                    </strong>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default PredictionHistory;