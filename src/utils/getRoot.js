let root;

export default function getRoot() {
  root = root || document.querySelector(':root');
  return root;
}
