namespace Test.Template.React.App.Server;

public static class SecurityHeadersDefinitions
{
    public static HeaderPolicyCollection GetHeaderPolicyCollection(bool isDev, string? idpHost, bool relaxCspForSwagger = false)
    {
        ArgumentNullException.ThrowIfNull(idpHost);

        var policy = new HeaderPolicyCollection()
            .AddFrameOptionsDeny()
            .AddContentTypeOptionsNoSniff()
            .AddReferrerPolicyStrictOriginWhenCrossOrigin()
            .AddCrossOriginOpenerPolicy(builder => builder.SameOrigin())
            .AddCrossOriginResourcePolicy(builder => builder.SameOrigin())
            .AddCrossOriginEmbedderPolicy(builder => builder.RequireCorp())
            .AddContentSecurityPolicy(builder =>
            {
                builder.AddObjectSrc().None();
                builder.AddBlockAllMixedContent();
                builder.AddImgSrc().Self().From("data:");
                builder.AddFormAction().Self().From(idpHost);
                builder.AddFontSrc().Self().From("data:");

                if (relaxCspForSwagger)
                {
                    builder.AddStyleSrc().Self().UnsafeInline();
                    builder.AddScriptSrc().Self().UnsafeInline();
                }
                else
                {
                    builder.AddStyleSrc()
                        .Self()
                        .WithNonce()
                        // fontSource Roboto font hashes
                        .WithHash256("EyaGFYPkxWlYpfdZrlDvgTmZBtzOVV/YtG0gmGGcPS8=")
                        .WithHash256("2AuzD+IlLUau2QP1PSqj0Gr8oWHA/GAq4BVwl041oPY=")
                        .WithHash256("i5WHALVp6FtGgGBiW7d0NfV0RwMPCUqGzAZP6tkTw+U=")
                        .WithHash256("q9g/FLZbht07QPPGvLc7r5D5+ZDrc3tfpKBV/BKfAvg=")
                        // browserLink hashes
                        .WithHash256("47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=")
                        .WithHash256("tVFibyLEbUGj+pO/ZSi96c01jJCvzWilvI5Th+wLeGE=")
                        // Swagger styles
                        .WithHash256("wkAU1AW/h8YFx0XlzvpTllAKnFEO2tw8aKErs5a26LY=");

                    builder.AddScriptSrc()
                        .Self()
                        // due to React
                        .WithHash256("/AO8vAagk08SqUGxY96ci/dGyTDsuoetPOJYMn7sc+E="); // VitePWA

                    if (isDev)
                    {
                        // due to React
                        builder.AddScriptSrc()
                            .Self()
                            .WithHash256("/AO8vAagk08SqUGxY96ci/dGyTDsuoetPOJYMn7sc+E=") // VitePWA
                            .WithHash256("8ZgGo/nOlaDknQkDUYiedLuFRSGJwIz6LAzsOrNxhmU=");
                    }
                }



                builder.AddBaseUri().Self();
                builder.AddFrameAncestors().None();



            })
            .RemoveServerHeader()
            .AddPermissionsPolicy(builder =>
            {
                builder.AddAccelerometer().None();
                builder.AddAutoplay().None();
                builder.AddCamera().None();
                builder.AddEncryptedMedia().None();
                builder.AddFullscreen().All();
                builder.AddGeolocation().None();
                builder.AddGyroscope().None();
                builder.AddMagnetometer().None();
                builder.AddMicrophone().None();
                builder.AddMidi().None();
                builder.AddPayment().None();
                builder.AddPictureInPicture().None();
                builder.AddSyncXHR().None();
                builder.AddUsb().None();
            });

        if (!isDev)
        {
            // maxage = one year in seconds
            policy.AddStrictTransportSecurityMaxAgeIncludeSubDomains(60 * 60 * 24 * 365);
        }

        policy.ApplyDocumentHeadersToAllResponses();

        return policy;
    }
}
