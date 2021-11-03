import React, { useEffect, useState } from "react";
import _ from "underscore";
import Databases from "metabase/entities/databases";
import SyncStatus from "../../components/SyncStatus";

const DONE_DELAY = 6000;

const SyncStatusApp = ({ databases }) => {
  const syncing = databases.filter(d => !d.initial_sync);
  const delayed = useDelayedValue(syncing, DONE_DELAY);
  const visible = _.uniq([syncing, delayed], false, d => d.id);

  if (visible.length) {
    return <SyncStatus databases={visible} />;
  } else {
    return null;
  }
};

const useDelayedValue = (value, delay) => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDelayedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return delayedValue;
};

export default _.compose(Databases.loadList())(SyncStatusApp);
