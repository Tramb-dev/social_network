import { Component } from "@angular/core";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  breadcrumbs: string = "Fil d'actualité";
  posts = [
    {
      id: "uuid",
      name: "Bidule",
      pictureUrl: "https://clipground.com/images/clipart-profile-6.jpg",
      pictureAlt: "Photo de profil de Bidule",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis omnis commodi est itaque fugit, reprehenderit a vitae eligendi quidem ad illo architecto. Consequatur quo laboriosam totam ullam sapiente facere veritatis, at rem molestiae dolorum laborum incidunt molestias delectus voluptatibus eaque velit soluta voluptates neque! Distinctio a, id harum voluptatibus ad in unde, nam rerum, numquam dolor officiis ex delectus. Deserunt tempora molestiae voluptate, error ducimus consequatur dolore vitae, repellat provident dolor sequi quasi, maxime exercitationem officiis saepe. Totam, cum amet.",
      comments: [
        {
          id: "uuid3",
          name: "Bidule",
          content:
            "Consequatur quo laboriosam totam ullam sapiente facere veritatis, at rem molestiae dolorum.",
        },
        {
          id: "uuid4",
          name: "Bidule2",
          content:
            "Deserunt tempora molestiae voluptate, error ducimus consequatur dolore vitae, repellat provident dolor sequi quasi, maxime exercitationem officiis saepe. Totam, cum amet.",
        },
      ],
    },
    {
      id: "uuid2",
      name: "Bidule2",
      pictureUrl: "https://clipground.com/images/clipart-profile-6.jpg",
      pictureAlt: "Photo de profil de Bidule",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis omnis commodi est itaque fugit, reprehenderit a vitae eligendi quidem ad illo architecto. Consequatur quo laboriosam totam ullam sapiente facere veritatis.",
    },
  ];

  constructor() {}
}
