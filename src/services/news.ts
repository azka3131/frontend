const API = "http://127.0.0.1:8000/api/admin/news";

export async function getNews() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://127.0.0.1:8000/api/news?type=news&admin=true",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil berita.");
  }

  return response.json();
}

export async function createNews(formData: FormData) {
  const token = localStorage.getItem("token");

  const response = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Gagal menambah berita.");
  }

  return data;
}