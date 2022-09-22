document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  document.querySelector('#compose-form').addEventListener('submit',send_email);

  // By default, load the inbox
  load_mailbox('inbox');
  refresh('inbox');
});

function send_email(event) {

  event.preventDefault();

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      load_mailbox("sent");
    })
    .catch((error) => console.log(error));
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#read-email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    {console.log(emails);
    for (let email of emails) {
      if (email.archived && mailbox == 'inbox'){
             }
      else {
        // tableDiv = tD
          const tD = document.createElement('div');

        // inboxTableDiv = inboxTD
          const inboxTD = document.createElement('tr');
          inboxTD.addEventListener('click', ()=>{
            see_email(email);
          });
          
          // senderEmailDiv = senderED
            const senderED = document.createElement('td');
            senderED.innerHTML = email.sender;

          // subjectEmailDiv = subjectED            
            const subjectED = document.createElement('td');
            subjectED.innerHTML = email.subject;

          // timestampEmailDiv = tsED
            const tsED = document.createElement('td');
            tsED.innerHTML = email.timestamp;

      // Appending to child
          document.querySelector('#emails-view').appendChild(tD);
            tD.appendChild(inboxTD);
            inboxTD.appendChild(senderED);
            inboxTD.appendChild(subjectED);
            inboxTD.appendChild(tsED);


        // STYLING

          // tableDivStyle = tDS
          const tDS = tD.style;
          tDS.border = '1px solid';
          if (email.read) {
            tDS.backgroundColor = 'white';
          }else{
            tDS.backgroundColor = "#787A91";
          }

          // inboxTableDivStyle = inboxTDS
          const inboxTDS =  inboxTD.style;
            inboxTDS.width = '100vw';
            

          // senderEmailDivStyle = senderEDS
          const senderEDS = senderED.style;
            senderEDS.width = '30vw';

          // subjectEmailDivStyle = senderEDS
          const subjectEDS = subjectED.style;
            subjectEDS.width = '40vw';

          // timestampEmailDivStyle = senderEDS
          const tsEDS = tsED.style;
            tsEDS.width = '30vw';
            tsEDS.display = "flex";
            tsEDS.justifyContent = "end";
            tsEDS.marginRight = "10px";
        
          if (mailbox != 'sent') {

          // buttonTableEmailDiv = buttonTED  ** making a table block for button element
          const buttonTED = document.createElement('td');

          // buttonEmailDiv = buttonED
            const buttonED = document.createElement('button');
            buttonED.innerHTML = 'Archive';

            inboxTD.appendChild(buttonTED);
            buttonTED.appendChild(buttonED);

            buttonED.addEventListener('click', () => {
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: !(email.archived)
                })
              }).then(() => load_mailbox(mailbox));
            });
          }
        }
    }}
   });
}

function see_email(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email').style.display = 'block';

  // ContainerDiv = CD
  fetch(`/emails/${email.id}`)
  .then(response => response.json())
  .then(email => {
    const CD = document.createElement('div');
    CD.setAttribute('class', 'CDC');
  // FromRow = FR
  const FR = document.createElement('tr');
    const FD1 = document.createElement('td');
      FD1.innerHTML = "From :";
    const FD2 = document.createElement('td');
      FD2.innerHTML = email.sender;
  // ToRow = TR
  const TR = document.createElement('tr');
    const TD1 = document.createElement('td');
      TD1.innerHTML = "To :";
    const TD2 = document.createElement('td');
      for (let recipient of email.recipients) {
        TD2.innerHTML += recipient;
      }
  // SubjectRow = SR
  const SR = document.createElement('tr');
    const SD1 = document.createElement('td');
      SD1.innerHTML = "Subject :";
    const SD2 = document.createElement('td');
      SD2.innerHTML = email.subject;
      
  // TimeStampRow = TSR
  const TSR = document.createElement('tr');
    const TSD1 = document.createElement('td');
      TSD1.innerHTML = "TimeStamp :";
    const TSD2 = document.createElement('td');
      TSD2.innerHTML = email.timestamp;

  // ReplyButton = RB
  const RB = document.createElement('button');
    RB.innerHTML = 'Reply';
    RB.setAttribute('class', 'btn btn-sm btn-outline-primary');
    RB.addEventListener('click', () => {
      compose_email()

      document.querySelector('#compose-recipients').value =  email.sender;
      document.querySelector('#compose-subject').value =  "Re: " + email.subject;
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
    });

  // Breaking Line hr element
  const breakingLine = document.createElement('hr');

  //  bodyDiv = BD

  const BD = document.createElement('span');
  BD.innerHTML = email.body;
  
  // Appending To Child
  document.querySelector('#read-email').appendChild(CD);
      CD.appendChild(FR);
          FR.appendChild(FD1);
          FR.appendChild(FD2);

      CD.appendChild(SR);
          SR.appendChild(SD1);
          SR.appendChild(SD2);

      CD.appendChild(TR);
          TR.appendChild(TD1);
          TR.appendChild(TD2);

      CD.appendChild(TSR);
          TSR.appendChild(TSD1);
          TSR.appendChild(TSD2);
      
      CD.appendChild(RB);
      
      CD.appendChild(breakingLine);

      CD.appendChild(BD);
  })
    // mark email as read
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    });
}

function refresh(mail) {
  document.querySelector(`#${mail}`).addEventListener('click', () => location.reload());
}