import PreLoader from '../PreLoader';

export default function PreLoaderExample() {
  return <PreLoader onComplete={() => console.log('Pre-loader complete')} />;
}
