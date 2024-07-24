const BASE_URL = `백엔드서버주소/around-station`;

export function findStartStation() {
  return fetch(`${BASE_URL}/lat&long`).then((response) => response.json());
}
