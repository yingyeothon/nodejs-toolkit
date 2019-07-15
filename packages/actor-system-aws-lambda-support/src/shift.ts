import { Lambda } from "aws-sdk";
import { IActorLambdaEvent } from "./handle/event";

interface IShiftToNextLambdaArguments {
  functionName: string;
  functionVersion?: string;
}

export const shiftToNextLambda = ({
  functionName,
  functionVersion
}: IShiftToNextLambdaArguments) => (actorName: string) =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify({
        actorName
      } as IActorLambdaEvent)
    })
    .promise();
