> _Hint:_
> _Describe all relevant environments, adjust the pages if needed. Don't forget the Dev-PC with the needed configuration...
> _The following overview is an example of useful description:_


| **Environment**<br/>- Respons.@Loc | **Abbrev.** | **Purpose** | **Data** | **Access** | **Config**<br/>- Sizing<br/>- Jobs | **Integration** | **Deployment**<br/>- Apploval by<br/>- Respons. for Deployment (Tool) |
|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| Development<br/>- isol@azure | DEV | - CI/CD, Unit-Tests of ongoing development | Annonym./synth. test data | isol | VM@Azure<br/>- small/medium<br/>- on-demand | Client-Side: Yes<br/>IAM: No	- auto (DevOps auto)<br/>DB/Doc: Yes (@Azure)<br/>Mail: Yes (@Azure)<br/>System XY: Test-Client<br/>System YZ: Mocked | After each Pull-Request<br/>- auto (DevOps)<br/>- auto (DevOps auto) |
| Test<br/>- isol@operator | TEST | - QS isol before delivery<br/>- Reference environment @operator to ensure, everything is runnable (e.g. Smoke-Tests)<br/>- Copy of prod SW version for analyzing / repro of Issues (synth. Data) | Annonym./synth. test data | Dev team<br/>QA isol<br/>Operator<br/>App owner<br/> | VM@customer<br/>- full (2 Inst.)<br/>- on demand | Client-Side: Yes<br/>IAM: Yes<br/>DB/Doc: Yes<br/>Mail: Yes<br/>System XY: Test-Client<br/>System YZ: Mocked | Before delivery<br/>- QM isol<br/>- auto (DevOps) |
| Integration<br/>- customer@operator | INT  | - Ensure, all components are working together as intended<br/>- QS (business) before going productive<br/>- Copy of prod SW version for analyzing / repro of Issues (prod. Data) | Copy of prod. data | QA isol<br/>QA customer<br/>Operator<br/>App owner | VM@customer<br/>- full (2 Inst.)<br/>- on-demand | Client-Side: Yes<br/>IAM: Yes<br/>DB/Doc: Yes<br/>Mail: Yes<br/>System XY: Yes<br/>System YZ: Yes | After approval QM isol<br/>- QM customer<br/>- auto (DevOps) |
| Produktion<br/>- customer@operator | PROD | - Productive operation | Prod. data | App owner<br/>Operator<br/>Prod User | VM@customer<br/>- full (2 Inst.)<br/>- active | Client-Side: Yes<br/>IAM: Yes<br/>DB/Doc: Yes<br/>Mail: Yes<br/>System XY: Yes<br/>System YZ: Yes | After approval QM customer<br/>- App owner<br/>- auto (DevOps) |




