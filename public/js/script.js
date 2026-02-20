const elementos = document.querySelectorAll(".animate");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 },
);

elementos.forEach((el) => observer.observe(el));

// Marketing básico
console.log("Landing page otimizada para conversão 🚀");

const animatedItems = document.querySelectorAll(".animate");

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 },
);

animatedItems.forEach((item) => scrollObserver.observe(item));

function editarCampo(idCampo) {
  const campo = document.getElementById(idCampo);
  if (!campo.disabled) return;
  campo.disabled = false;
  campo.focus();
}

let action = null;

function confirmCreate() {
  document.getElementById("confirmTitle").innerText = "Confirmar cadastro";
  document.getElementById("confirmText").innerText =
    "Deseja realmente cadastrar um novo usuário?";

  action = "create";

  new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

function confirmEdit() {
  document.getElementById("confirmTitle").innerText = "Confirmar edição";
  document.getElementById("confirmText").innerText =
    "Deseja realmente editar os dados deste usuário?";

  action = "edit";
  new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

function confirmDelete() {
  document.getElementById("confirmTitle").innerText = "Confirmar exclusão";
  document.getElementById("confirmText").innerText =
    "Esta ação não pode ser desfeita. Deseja continuar?";

  action = "delete";
  new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

document.getElementById("confirmBtn").onclick = function () {
  if (action === "edit") {
    toggleEdicao("userNome");
    showSuccessToast("Edição habilitada com sucesso!");
  }

  if (action === "delete") {
    showSuccessToast("Usuário excluído com sucesso!");
    setTimeout(() => {
      window.location.href = "usuarios";
    }, 1200);
  }

  if (action === "create") {
    showSuccessToast("Usuário cadastrado com sucesso!");

    // exemplo de redirecionamento
    setTimeout(() => {
      window.location.href = "usuarios";
    }, 1200);
  }

  bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();
};

// =======================
// TOAST
// =======================
function showSuccessToast(message) {
  const toastEl = document.getElementById("successToast");
  toastEl.querySelector(".toast-body").innerText = message;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 9000,
  });
  toast.show();
}

function limparFormulario2() {
  document.getElementById("userForm").reset();
}

function limparFormulario3() {
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("dn").value = "";
  document.getElementById("categ").value = "";
  document.getElementById("sel").innerHTML = "";
  document.getElementById("nome").focus();
}

function preencher() {
  const nome = campo.value;

  const alertSuccess = document.getElementById("alertSuccess");
  const alertDanger = document.getElementById("alertDanger");

  // 🔹 Sempre esconder as duas antes de começar
  alertSuccess.hidden = true;
  alertDanger.hidden = true;

  const usuario = usuarios.find((u) => u.nomeUsuario === nome);

  if (usuario) {
    alertSuccess.innerText = "Usuário encontrado: " + usuario.nomeUsuario;
    alertSuccess.hidden = false;
    setTimeout(() => {
      alertSuccess.hidden = true;
      alertDanger.hidden = true;
    }, 5000);

    document.getElementById("userId").value = usuario.idUsuario;
    console.log("ID do usuário encontrado:", usuario.idUsuario);
    document.getElementById("userNome").value = usuario.nomeUsuario;
    console.log("Nome do usuário encontrado:", usuario.nomeUsuario);
    document.getElementById("userEmail").value = usuario.emailUsuario;
    console.log("Email do usuário encontrado:", usuario.emailUsuario);
    document.getElementById("userDn").value = usuario.dnUsuario;
    console.log("Data de nascimento do usuário encontrado:", usuario.dnUsuario);
    document.getElementById("categ").value = usuario.categoriaUsuario;
    console.log("Categoria do usuário encontrado:", usuario.categoriaUsuario);
  } else {
    alertDanger.innerText = "Usuário não encontrado";
    alertDanger.hidden = false;
    setTimeout(() => {
      alertSuccess.hidden = true;
      alertDanger.hidden = true;
    }, 5000);
  }
}
