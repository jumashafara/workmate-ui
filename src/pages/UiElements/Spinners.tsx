import {
  ClipLoader as ReactClipLoader,
  SyncLoader as ReactSyncLoader,
  BeatLoader as ReactBeatLoader,
  ScaleLoader as ReactScaleLoader,
  BounceLoader as ReactBounceLoader,
  PuffLoader as ReactPuffLoader,
} from "react-spinners";

const css_override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  color: "#999"
};

interface Props {
  loading: boolean;
}

const ClipLoader = (props: Props) => {
  return (
    <ReactClipLoader
      color="#008374"
      loading={props.loading}
      size={150}
      cssOverride={css_override}
    />
  );
};

const BeatLoader = (props: Props) => {
  return (
    <ReactBeatLoader
      loading={props.loading}
      size={10}
      cssOverride={css_override}
    />
  );
};

const ScaleLoader = (props: Props) => {
  return (
    <ReactScaleLoader loading={props.loading} cssOverride={css_override} />
  );
};

//   export { ClipLoader, BeatLoader, ScaleLoader };

const PuffLoader = (props: Props) => {
  return <ReactPuffLoader loading={props.loading} cssOverride={css_override} />;
};

const BounceLoader = (props: Props) => {
  return (
    <ReactBounceLoader loading={props.loading} cssOverride={css_override} />
  );
};

const SyncLoader = (props: Props) => {
  return <ReactSyncLoader loading={props.loading} cssOverride={css_override} />;
};

export {
  ClipLoader,
  BeatLoader,
  ScaleLoader,
  PuffLoader,
  BounceLoader,
  SyncLoader,
};
